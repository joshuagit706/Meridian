# Adashe Frontend

**Adashe** is a trustless community savings platform built for transparency, automation, and shared financial visibility. This repository holds the frontend application, which delivers real-time dashboards and an intuitive interface for savings groups, circles, and participants.

---

## 💰 What this frontend does

Adashe Frontend is a React + Next.js application designed to support decentralized community savings by:

* Visualizing active savings circles and contribution progress.
* Displaying immutable on-chain records for contributions, payout history, and round activity.
* Showing automated payout status once a round is complete.
* Delivering a responsive experience across desktop, tablet, and mobile.

---

## ⚙️ Core frontend capabilities

- **Dashboard UI** — central financial view for organizers and members.
- **Wallet/session support** — wallet connection and session handling for each user.
- **Circle overview** — list active groups with current round, contribution status, and upcoming payouts.
- **Detailed group view** — inspect individual circle history, contributions, and payout timeline.
- **Notifications** — surface alerts for round completion, missed contributions, and payout updates.
- **Payout history** — show past distribution activity and relevant on-chain details.
- **Organizer tools** — manage circles and monitor overall group performance.
- **Participant view** — track personal progress inside each savings circle.

---

## 🚀 Getting started

### Prerequisites

* Node.js v16 or higher
* npm

### Install and run

```bash
# Clone the frontend repository
git clone https://github.com/adashe/adashe-frontend.git
cd adashe-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

> If this frontend lives inside a larger monorepo, use the correct repo path instead of cloning directly.

---

## 🤝 Contributing

Contributions are welcome!

### How to contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

### Branch strategy

* `main` — stable releases
* `dev` — active development
* `feature/*` — individual features or fixes

### Pull request guidelines

* Keep changes small and focused
* Use clear commit messages
* Update documentation when functionality changes

### Commit convention

This project follows Conventional Commits:

* `feat` — new feature
* `fix` — bug fix
* `docs` — documentation only
* `refactor` — code change without feature/fix
* `chore` — maintenance task

---

## 🔗 Useful links

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Stellar CLI Reference](https://developers.stellar.org/docs/tools/developer-tools)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🛡️ License

This project is licensed under the **MIT License**.

---

## 📬 Contact

* [Telegram: Adashe Telegram Group](https://t.me/adashe)
