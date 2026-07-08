#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, BytesN, Env, String,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Create a fresh environment with all auths mocked and a predictable
/// ledger timestamp so tests are deterministic.
fn setup_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1_700_000_000;
    });
    env
}

/// Convenience: deploy + initialize the contract, returning the client and
/// the admin address.
fn deploy(env: &Env) -> (SupplyChainContractClient, Address) {
    let contract_id = env.register(SupplyChainContract, ());
    let client = SupplyChainContractClient::new(env, &contract_id);
    let admin = Address::generate(env);
    client.initialize(&admin);
    (client, admin)
}

/// Build a deterministic 32-byte hash from a seed byte.
fn make_hash(env: &Env, seed: u8) -> BytesN<32> {
    BytesN::from_array(env, &[seed; 32])
}

fn make_string(env: &Env, s: &str) -> String {
    String::from_str(env, s)
}

// ---------------------------------------------------------------------------
// 1. initialize
// ---------------------------------------------------------------------------

#[test]
fn test_initialize() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let actor = client.get_actor(&admin);
    assert_eq!(actor.address, admin);
    assert_eq!(actor.role, Role::Admin);
    assert!(actor.active);
}

// ---------------------------------------------------------------------------
// 2. register_actor
// ---------------------------------------------------------------------------

#[test]
fn test_register_actor() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer_addr = Address::generate(&env);
    client.register_actor(
        &admin,
        &producer_addr,
        &Role::Producer,
        &make_string(&env, "FarmCo"),
    );

    let actor = client.get_actor(&producer_addr);
    assert_eq!(actor.address, producer_addr);
    assert_eq!(actor.role, Role::Producer);
    assert_eq!(actor.name, make_string(&env, "FarmCo"));
    assert!(actor.active);
}

// ---------------------------------------------------------------------------
// 3. register_batch
// ---------------------------------------------------------------------------

#[test]
fn test_register_batch() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    client.register_actor(
        &admin,
        &producer,
        &Role::Producer,
        &make_string(&env, "FarmCo"),
    );

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0xAA));
    assert_eq!(batch_id, 1u64);

    let batch = client.get_batch(&batch_id);
    assert_eq!(batch.id, 1u64);
    assert_eq!(batch.current_holder, producer);
    assert_eq!(batch.origin_actor, producer);
    assert_eq!(batch.metadata_hash, make_hash(&env, 0xAA));
}

// ---------------------------------------------------------------------------
// 4. full chain of custody
// ---------------------------------------------------------------------------

#[test]
fn test_full_chain_of_custody() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    let processor = Address::generate(&env);
    let distributor = Address::generate(&env);
    let retailer = Address::generate(&env);

    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));
    client.register_actor(&admin, &processor, &Role::Processor, &make_string(&env, "MillCo"));
    client.register_actor(&admin, &distributor, &Role::Distributor, &make_string(&env, "LogiCo"));
    client.register_actor(&admin, &retailer, &Role::Retailer, &make_string(&env, "ShopCo"));

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0x01));

    // Transfer 1: producer → processor
    client.transfer_custody(
        &producer,
        &processor,
        &batch_id,
        &make_string(&env, "Farm Gate"),
        &make_hash(&env, 0x10),
    );

    // Transfer 2: processor → distributor
    client.transfer_custody(
        &processor,
        &distributor,
        &batch_id,
        &make_string(&env, "Processing Plant"),
        &make_hash(&env, 0x20),
    );

    // Transfer 3: distributor → retailer
    client.transfer_custody(
        &distributor,
        &retailer,
        &batch_id,
        &make_string(&env, "Distribution Hub"),
        &make_hash(&env, 0x30),
    );

    let batch = client.get_batch(&batch_id);
    assert_eq!(batch.current_holder, retailer);

    let history = client.get_history(&batch_id);
    assert_eq!(history.len(), 3u32);
}

// ---------------------------------------------------------------------------
// 5. unauthorized transfer panics (attacker is not current holder)
// ---------------------------------------------------------------------------

#[test]
#[should_panic]
fn test_unauthorized_transfer_panics() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    let processor = Address::generate(&env);
    let attacker = Address::generate(&env);

    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));
    client.register_actor(&admin, &processor, &Role::Processor, &make_string(&env, "MillCo"));
    client.register_actor(&admin, &attacker, &Role::Distributor, &make_string(&env, "BadActor"));

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0x01));

    // Attacker is not the current holder — must panic.
    client.transfer_custody(
        &attacker,
        &processor,
        &batch_id,
        &make_string(&env, "Stolen Warehouse"),
        &make_hash(&env, 0xFF),
    );
}

// ---------------------------------------------------------------------------
// 6. transfer to unregistered address panics
// ---------------------------------------------------------------------------

#[test]
#[should_panic]
fn test_transfer_to_unregistered_panics() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    let unknown = Address::generate(&env); // never registered

    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0x01));

    // `unknown` is not in the registry — must panic.
    client.transfer_custody(
        &producer,
        &unknown,
        &batch_id,
        &make_string(&env, "Nowhere"),
        &make_hash(&env, 0xEE),
    );
}

// ---------------------------------------------------------------------------
// 7. transfer to deactivated actor fails
// ---------------------------------------------------------------------------

#[test]
fn test_transfer_to_deactivated_fails() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    let processor = Address::generate(&env);

    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));
    client.register_actor(&admin, &processor, &Role::Processor, &make_string(&env, "MillCo"));

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0x01));

    // Deactivate the processor before attempting transfer.
    client.deactivate_actor(&admin, &processor);

    let result = client.try_transfer_custody(
        &producer,
        &processor,
        &batch_id,
        &make_string(&env, "Plant Dock"),
        &make_hash(&env, 0x11),
    );

    assert!(result.is_err());
    assert_eq!(result.unwrap_err(), Ok(Error::ActorNotActive));
}

// ---------------------------------------------------------------------------
// 8. history retrieval correctness
// ---------------------------------------------------------------------------

#[test]
fn test_history_retrieval_correctness() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    let processor = Address::generate(&env);

    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));
    client.register_actor(&admin, &processor, &Role::Processor, &make_string(&env, "MillCo"));

    let batch_id = client.register_batch(&producer, &make_hash(&env, 0x01));

    let location = make_string(&env, "Port A");
    let doc = make_hash(&env, 0x55);

    client.transfer_custody(&producer, &processor, &batch_id, &location, &doc);

    let history = client.get_history(&batch_id);
    assert_eq!(history.len(), 1u32);

    let evt = history.get(0).unwrap();
    assert_eq!(evt.batch_id, batch_id);
    assert_eq!(evt.from, producer);
    assert_eq!(evt.to, processor);
    assert_eq!(evt.location, location);
    assert_eq!(evt.doc_hash, doc);
}

// ---------------------------------------------------------------------------
// 9. non-producer cannot register batch (panics)
// ---------------------------------------------------------------------------

#[test]
#[should_panic]
fn test_non_producer_cannot_register_batch_panics() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let processor = Address::generate(&env);
    client.register_actor(&admin, &processor, &Role::Processor, &make_string(&env, "MillCo"));

    // Processor calling register_batch must panic.
    client.register_batch(&processor, &make_hash(&env, 0x01));
}

// ---------------------------------------------------------------------------
// 10. batch count increments
// ---------------------------------------------------------------------------

#[test]
fn test_batch_count_increments() {
    let env = setup_env();
    let (client, admin) = deploy(&env);

    let producer = Address::generate(&env);
    client.register_actor(&admin, &producer, &Role::Producer, &make_string(&env, "FarmCo"));

    let id1 = client.register_batch(&producer, &make_hash(&env, 0x01));
    let id2 = client.register_batch(&producer, &make_hash(&env, 0x02));
    let id3 = client.register_batch(&producer, &make_hash(&env, 0x03));

    assert_eq!(id1, 1u64);
    assert_eq!(id2, 2u64);
    assert_eq!(id3, 3u64);
}
