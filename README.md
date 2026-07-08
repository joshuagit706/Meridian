<p align="center">
  <img src="frontend/public/logo.svg" alt="Lineage logo" width="110" />
</p>

<h1 align="center">Lineage</h1>

**Lineage** is a supply chain provenance and anti-counterfeiting platform built on the Stellar blockchain. Producers, processors, distributors, and retailers log every custody handoff on-chain. Consumers scan a QR code on physical packaging to see the complete, tamper-proof history of a product — no account required.

Every document stays off-chain on IPFS. Only cryptographic hashes land on the Stellar ledger, keeping the contract lean and the audit trail permanent.

---

## What's inside

| Layer | Stack |
|-------|-------|
| Smart contract | Rust · Soroban · Stellar Testnet |
| Backend | Node.js · TypeScript · Express · Prisma · PostgreSQL |
| File storage | IPFS via Pinata (hashes only on-chain) |
| Frontend | React 18 · TypeScript · Tailwind CSS · Vite |
| Wallet | Freighter browser extension |

---

## Quick start

### 1. Smart contract

```bash
# Install Rust and the WASM target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli --features opt

cd contract

# Run the test suite (10 tests)
cargo test

# Deploy to Testnet
soroban keys generate --global deployer --network testnet
soroban keys fund deployer --network testnet
export DEPLOYER_SECRET=$(soroban keys show deployer --network testnet)
./deploy.sh
```

The deploy script prints your `CONTRACT_ID` and a ready-to-paste `.env` snippet.

### 2. Backend

```bash
cd backend
cp .env.example .env        # fill in the values from the deploy script
npm install
npm run db:generate         # generate Prisma client
npm run db:push             # push schema to Postgres
npm run dev                 # starts on :3000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL and VITE_CONTRACT_ID
npm install
npm run dev                 # starts on :5173
```

Open `http://localhost:5173`, install the [Freighter extension](https://freighter.app), and switch it to **Testnet**.

---

## Contract functions

| Function | Who can call | What it does |
|----------|-------------|--------------|
| `initialize(admin)` | — | One-time setup, sets the admin address |
| `register_actor(admin, actor, role, name)` | Admin | Adds a supply chain participant |
| `deactivate_actor(admin, actor)` | Admin | Revokes an actor |
| `register_batch(producer, metadata_hash)` | Producer | Creates a new batch, returns its `u64` ID |
| `transfer_custody(from, to, batch_id, location, doc_hash)` | Current holder | Moves custody to the next actor |
| `get_batch(batch_id)` | Public | Returns current batch state |
| `get_history(batch_id)` | Public | Returns the full transfer log |
| `get_actor(address)` | Public | Returns actor info |

Roles available: `Producer`, `Processor`, `Distributor`, `Retailer`, `Auditor`, `Admin`.

---

## API reference

### Auth

```
GET  /auth/challenge?address={G...}
     → { challenge }

POST /auth/verify
     { address, challenge, signedXdr }
     → { token, actor }
```

Actors sign a minimal Stellar transaction (memo = challenge prefix) with Freighter. The backend verifies the Ed25519 signature on the transaction hash and issues a JWT.

### Actors

```
POST  /actors                       Admin — register actor on-chain + DB
GET   /actors?role=Producer         List active actors (public)
GET   /actors/:address              Single actor (public)
PATCH /actors/:address/deactivate   Admin — deactivate actor
```

### Batches

```
POST /batches/prepare               Producer — upload docs to IPFS, get unsigned XDR
POST /batches                       Producer — submit Freighter-signed XDR, get QR code
POST /batches/:id/transfer/prepare  Actor — upload doc to IPFS, get unsigned XDR
POST /batches/:id/transfer          Actor — submit signed XDR, record transfer
GET  /batches/:id                   Public — batch details + full custody history
GET  /batches/:id/qr                Public — QR code PNG (printable)
GET  /batches                       Actor — my batches (in custody or produced)
```

### Health

```
GET /health → { status, version, timestamp }
```

---

## How a batch moves through the chain

**Register**
1. Producer fills in metadata and uploads documents on the dashboard
2. Backend uploads documents to IPFS, computes a SHA-256 hash, builds an unsigned Soroban transaction
3. Freighter signs the transaction in the browser
4. Backend submits it, reads the real batch ID from the contract return value, generates a QR code

**Transfer custody**
1. Actor selects a batch they hold, picks the next actor, enters location
2. Backend builds the unsigned transfer transaction (optionally uploads a handoff document to IPFS first)
3. Freighter signs
4. Backend submits, records the event in Postgres, updates `currentHolder`

**Consumer scan**
1. Consumer scans the QR code on the packaging
2. Browser opens `/verify/{batchId}` — no login, no app install
3. Page shows the full timeline: origin → each transfer → current holder, with actor names, dates, locations, and links to IPFS documents

---

## Environment variables

### `backend/.env`

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | At least 32 random characters |
| `CONTRACT_ID` | Yes | From `deploy.sh` output |
| `SOROBAN_RPC_URL` | Yes | `https://soroban-testnet.stellar.org` |
| `NETWORK_PASSPHRASE` | Yes | `Test SDF Network ; September 2015` |
| `ADMIN_SECRET_KEY` | Yes | Stellar secret key of the deployer |
| `PINATA_API_KEY` | Yes | Pinata dashboard |
| `PINATA_SECRET_KEY` | Yes | Pinata dashboard |
| `APP_URL` | Yes | Frontend URL — embedded in QR codes |
| `CORS_ORIGIN` | Yes | Frontend origin |
| `PORT` | No | Default `3000` |
| `LOG_LEVEL` | No | Default `info` |
| `QR_STORAGE_PATH` | No | Default `./storage/qr` |

### `frontend/.env`

| Variable | Notes |
|----------|-------|
| `VITE_API_URL` | Backend base URL |
| `VITE_CONTRACT_ID` | Same as backend |
| `VITE_NETWORK_PASSPHRASE` | Stellar network passphrase |
| `VITE_STELLAR_EXPLORER` | `https://stellar.expert/explorer/testnet` |

---

## Running locally with Docker

```bash
# Start Postgres and Redis
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=pass postgres:15
docker run -d -p 6379:6379 redis:7

# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

---

## Security

- `.env` files are git-ignored — never commit secrets.
- The admin secret key should live in a secrets manager (AWS Secrets Manager, HashiCorp Vault) in production.
- Custody transfers are enforced at the contract level via `from.require_auth()` — only the current holder's Stellar keypair can move a batch.
- Documents never touch the chain. IPFS CIDs are content-addressed — anyone with the hash can independently verify file integrity.
- JWTs expire after 7 days. Rotate `JWT_SECRET` to invalidate all active sessions immediately.
- File uploads are restricted to PDF, JPEG, PNG, WebP, and plain text — 10 MB per file, 5 files per request.
