# Contributors

Thanks to everyone who has helped build **Lineage** — supply chain provenance
and anti-counterfeiting on the Stellar blockchain.

## Maintainers

| Name | GitHub | Role |
|------|--------|------|
| joshuagit706 | [@joshuagit706](https://github.com/joshuagit706) | Creator & maintainer |

## How to contribute

Contributions are welcome across the whole stack — the Soroban smart contract,
the Node.js backend, and the React frontend.

1. **Fork** the repository and create a branch off `main`
   (`git checkout -b feature/your-change`).
2. **Make your change.** Keep it focused and match the style of the surrounding
   code.
3. **Verify it works:**
   - Contract: `cd contract && cargo test` (10 tests must pass)
   - Backend: `cd backend && npm run build`
   - Frontend: `cd frontend && npm run build`
4. **Commit** with a clear message describing the change and why.
5. **Open a pull request** against `main` and describe what you changed and how
   you tested it.

## Contribution areas

- **Smart contract** (`contract/`) — Rust / Soroban SDK. On-chain custody logic,
  actor registry, batch lifecycle.
- **Backend** (`backend/`) — TypeScript / Express / Prisma. REST API, Stellar
  transaction building, IPFS pinning, chain-event indexer.
- **Frontend** (`frontend/`) — React / Vite / Tailwind. Dashboard, wallet auth,
  client-side QR generation, public verification page.

## Guidelines

- Never commit secrets. `.env` files are git-ignored — use `.env.example` as the
  template.
- Validate and sanitize all external input; this project handles wallet
  signatures and file uploads.
- Add or update tests when you change contract behavior.
- Keep the three packages independent — the contract, backend, and frontend
  build and run on their own.

---

*Want to see your name here? Open a pull request.*
