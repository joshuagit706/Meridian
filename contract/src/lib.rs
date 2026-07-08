#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, BytesN, Env, String, Vec, symbol_short,
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    ActorNotFound = 4,
    ActorNotActive = 5,
    BatchNotFound = 6,
    NotCurrentHolder = 7,
    NotProducer = 8,
}

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Role {
    Producer = 0,
    Processor = 1,
    Distributor = 2,
    Retailer = 3,
    Auditor = 4,
    Admin = 5,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Actor {
    pub address: Address,
    pub role: Role,
    pub name: String,
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Batch {
    pub id: u64,
    pub origin_actor: Address,
    pub created_at: u64,
    pub metadata_hash: BytesN<32>,
    pub current_holder: Address,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct TransferEvent {
    pub batch_id: u64,
    pub from: Address,
    pub to: Address,
    pub timestamp: u64,
    pub location: String,
    pub doc_hash: BytesN<32>,
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Actor(Address),
    Batch(u64),
    BatchHistory(u64),
    BatchCount,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct SupplyChainContract;

#[contractimpl]
impl SupplyChainContract {
    /// One-time initialisation. Stores the admin address, seeds the batch
    /// counter and registers the admin as an Actor with the Admin role.
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().persistent().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::BatchCount, &0u64);

        let admin_actor = Actor {
            address: admin.clone(),
            role: Role::Admin,
            name: String::from_str(&env, "Admin"),
            active: true,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Actor(admin.clone()), &admin_actor);

        Ok(())
    }

    /// Register a new actor in the supply chain. Only callable by the admin.
    pub fn register_actor(
        env: Env,
        admin: Address,
        actor_addr: Address,
        role: Role,
        name: String,
    ) -> Result<(), Error> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();

        let actor = Actor {
            address: actor_addr.clone(),
            role,
            name,
            active: true,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Actor(actor_addr), &actor);

        Ok(())
    }

    /// Deactivate an existing actor. Only callable by the admin.
    pub fn deactivate_actor(
        env: Env,
        admin: Address,
        actor_addr: Address,
    ) -> Result<(), Error> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();

        let key = DataKey::Actor(actor_addr.clone());
        let mut actor: Actor = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::ActorNotFound)?;

        actor.active = false;
        env.storage().persistent().set(&key, &actor);

        Ok(())
    }

    /// Register a new product batch. Caller must be an active Producer.
    /// Returns the newly assigned batch ID (1-indexed, incrementing).
    pub fn register_batch(
        env: Env,
        producer: Address,
        metadata_hash: BytesN<32>,
    ) -> Result<u64, Error> {
        producer.require_auth();

        // Verify the caller is a registered, active Producer.
        let actor: Actor = env
            .storage()
            .persistent()
            .get(&DataKey::Actor(producer.clone()))
            .ok_or(Error::ActorNotFound)?;

        if !actor.active {
            return Err(Error::ActorNotActive);
        }
        if actor.role != Role::Producer {
            return Err(Error::NotProducer);
        }

        // Increment and store the batch counter.
        let count: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::BatchCount)
            .ok_or(Error::NotInitialized)?;
        let new_id = count + 1;
        env.storage()
            .persistent()
            .set(&DataKey::BatchCount, &new_id);

        let now = env.ledger().timestamp();
        let batch = Batch {
            id: new_id,
            origin_actor: producer.clone(),
            created_at: now,
            metadata_hash,
            current_holder: producer.clone(),
        };
        env.storage()
            .persistent()
            .set(&DataKey::Batch(new_id), &batch);

        // Initialise an empty transfer history for the batch.
        let history: Vec<TransferEvent> = Vec::new(&env);
        env.storage()
            .persistent()
            .set(&DataKey::BatchHistory(new_id), &history);

        env.events().publish(
            (symbol_short!("batch"), symbol_short!("register")),
            (new_id, producer),
        );

        Ok(new_id)
    }

    /// Transfer custody of a batch from one actor to another.
    /// `from` must be the current holder; `to` must be registered and active.
    pub fn transfer_custody(
        env: Env,
        from: Address,
        to: Address,
        batch_id: u64,
        location: String,
        doc_hash: BytesN<32>,
    ) -> Result<(), Error> {
        from.require_auth();

        let batch_key = DataKey::Batch(batch_id);
        let mut batch: Batch = env
            .storage()
            .persistent()
            .get(&batch_key)
            .ok_or(Error::BatchNotFound)?;

        if batch.current_holder != from {
            return Err(Error::NotCurrentHolder);
        }

        // Verify recipient is registered and active.
        let to_actor: Actor = env
            .storage()
            .persistent()
            .get(&DataKey::Actor(to.clone()))
            .ok_or(Error::ActorNotFound)?;

        if !to_actor.active {
            return Err(Error::ActorNotActive);
        }

        let now = env.ledger().timestamp();
        let event = TransferEvent {
            batch_id,
            from: from.clone(),
            to: to.clone(),
            timestamp: now,
            location,
            doc_hash,
        };

        // Append to history.
        let history_key = DataKey::BatchHistory(batch_id);
        let mut history: Vec<TransferEvent> = env
            .storage()
            .persistent()
            .get(&history_key)
            .unwrap_or_else(|| Vec::new(&env));
        history.push_back(event);
        env.storage().persistent().set(&history_key, &history);

        // Update current holder.
        batch.current_holder = to.clone();
        env.storage().persistent().set(&batch_key, &batch);

        env.events().publish(
            (symbol_short!("custody"), symbol_short!("transfer")),
            (batch_id, from, to),
        );

        Ok(())
    }

    /// Return the `Batch` struct for the given ID.
    pub fn get_batch(env: Env, batch_id: u64) -> Result<Batch, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Batch(batch_id))
            .ok_or(Error::BatchNotFound)
    }

    /// Return the full transfer history for the given batch ID.
    /// Returns an empty Vec if the batch exists but has no transfers yet.
    pub fn get_history(env: Env, batch_id: u64) -> Vec<TransferEvent> {
        env.storage()
            .persistent()
            .get(&DataKey::BatchHistory(batch_id))
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Return the `Actor` struct for the given address.
    pub fn get_actor(env: Env, address: Address) -> Result<Actor, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Actor(address))
            .ok_or(Error::ActorNotFound)
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    fn require_admin(env: &Env, caller: &Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        if &admin != caller {
            return Err(Error::Unauthorized);
        }
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

mod test;
