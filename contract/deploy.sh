#!/bin/bash
set -e

echo "Building contract..."
cargo build --target wasm32-unknown-unknown --release

WASM="target/wasm32-unknown-unknown/release/supply_chain_contract.wasm"

echo "Optimizing WASM..."
soroban contract optimize --wasm "$WASM"

echo "Deploying to Testnet..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm "${WASM%.wasm}.optimized.wasm" \
  --source "$DEPLOYER_SECRET" \
  --network testnet)

echo "CONTRACT_ID=$CONTRACT_ID"

echo "Initializing contract..."
soroban contract invoke \
  --id "$CONTRACT_ID" \
  --source "$DEPLOYER_SECRET" \
  --network testnet \
  -- initialize \
  --admin "$(stellar keys address $DEPLOYER_SECRET 2>/dev/null || soroban keys address $DEPLOYER_SECRET)"

echo ""
echo "=== .env snippet ==="
echo "CONTRACT_ID=$CONTRACT_ID"
echo "SOROBAN_RPC_URL=https://soroban-testnet.stellar.org"
echo 'NETWORK_PASSPHRASE="Test SDF Network ; September 2015"'
