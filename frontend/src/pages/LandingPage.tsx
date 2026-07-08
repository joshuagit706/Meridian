import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  MapPin,
  QrCode,
  Radar,
  ScanLine,
  ShieldCheck,
  Users,
} from 'lucide-react';

// ─── Header ───────────────────────────────────────────────────────────────────

function LandingHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="max-w-6xl mx-auto px-5 pt-4">
        <div className="glass-strong rounded-2xl px-5 h-14 flex items-center justify-between shadow-inner-light">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="w-7 h-7 rounded-lg" />
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Lineage
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              ['Features', '#features'],
              ['How it works', '#how-it-works'],
              ['Verify', '/verify/demo'],
            ].map(([label, href]) =>
              href.startsWith('#') ? (
                <a
                  key={label}
                  href={href}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-ink-900 text-sm font-semibold hover:bg-stellar-50 transition-colors"
          >
            Launch App
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero mock: a floating verification card ──────────────────────────────────

function HeroMockCard() {
  const steps = [
    {
      label: 'Batch registered',
      actor: 'Finca La Esperanza',
      role: 'Producer',
      place: 'Huila, Colombia',
      done: true,
    },
    {
      label: 'Custody transferred',
      actor: 'Andes Processing Co.',
      role: 'Processor',
      place: 'Bogotá, Colombia',
      done: true,
    },
    {
      label: 'Custody transferred',
      actor: 'Atlantic Freight Ltd.',
      role: 'Distributor',
      place: 'Rotterdam, Netherlands',
      done: true,
    },
  ];

  return (
    <div className="relative animate-float">
      {/* Glow behind the card */}
      <div className="absolute -inset-8 bg-stellar-600/25 blur-3xl rounded-full pointer-events-none" />

      <div className="relative glass-strong rounded-3xl p-6 w-full max-w-md shadow-glow-lg">
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stellar-600/20 border border-stellar-500/30 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-stellar-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Single-Origin Coffee</p>
              <p className="text-slate-400 text-xs font-mono mt-0.5">Batch #4217</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-stellar-600/25 border border-stellar-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stellar-300" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-1 bg-gradient-to-b from-stellar-500/40 to-stellar-500/10" />
                )}
              </div>
              <div className={i < steps.length - 1 ? 'pb-5' : ''}>
                <p className="text-white text-sm font-medium leading-tight">{s.label}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {s.actor} · <span className="text-stellar-300">{s.role}</span>
                </p>
                <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {s.place}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Card footer */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <p className="text-slate-500 text-xs">Recorded on Stellar</p>
          <p className="text-stellar-300 text-xs font-mono">tx 7f3a…c94e</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Immutable custody records',
    desc: 'Every handoff is signed by the current holder and written to a Soroban smart contract. No one — not even us — can rewrite history.',
  },
  {
    icon: QrCode,
    title: 'Consumer QR verification',
    desc: 'A printed QR code opens the full provenance timeline in any browser. No app, no account, no friction.',
  },
  {
    icon: FileCheck2,
    title: 'Tamper-proof documents',
    desc: 'Certificates and inspection reports live on IPFS; only their SHA-256 fingerprints go on-chain, so integrity is independently checkable.',
  },
  {
    icon: Users,
    title: 'Role-based actor network',
    desc: 'Producers, processors, distributors, retailers and auditors — each registered on-chain with permissions enforced by the contract.',
  },
  {
    icon: Fingerprint,
    title: 'Wallet-native authentication',
    desc: 'Actors sign challenges with their Stellar wallet. Ed25519 signatures replace passwords entirely.',
  },
  {
    icon: Radar,
    title: 'Real-time chain indexer',
    desc: 'A background indexer streams contract events into Postgres, keeping dashboards live without hammering the RPC.',
  },
];

const STEPS = [
  {
    n: '01',
    icon: Boxes,
    title: 'Register the batch',
    desc: 'The producer uploads documents, and the batch is minted on-chain with a hash of its metadata. A QR code is generated for the packaging.',
  },
  {
    n: '02',
    icon: ArrowRight,
    title: 'Transfer custody',
    desc: 'At every handoff, the current holder signs the transfer with their wallet — location, timestamp and documents are sealed into the record.',
  },
  {
    n: '03',
    icon: ScanLine,
    title: 'Scan and trust',
    desc: 'Anyone scans the QR code and sees the full journey, cryptographically verified against the Stellar ledger in seconds.',
  },
];

const STATS = [
  ['~5s', 'ledger finality'],
  ['$0.00001', 'per transaction'],
  ['100%', 'verifiable on-chain'],
  ['0', 'passwords stored'],
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white overflow-x-clip">
      <LandingHeader />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-5">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid mask-radial pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-stellar-700/30 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            {/* Live badge */}
            <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-sm text-slate-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Live on Stellar Testnet
            </div>

            <h1 className="animate-fade-up-delay-1 font-display text-display-sm sm:text-display font-bold text-gradient">
              Every product
              <br />
              has a story.
              <br />
              <span className="text-gradient-blue">Prove it.</span>
            </h1>

            <p className="animate-fade-up-delay-2 text-slate-400 text-lg leading-relaxed max-w-md mt-6 mb-10">
              Lineage seals your supply chain onto the Stellar blockchain — every
              handoff signed, every document fingerprinted, every product verifiable
              with one scan.
            </p>

            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3.5">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-stellar-600 hover:bg-stellar-500 text-white font-semibold text-sm transition-all shadow-glow hover:shadow-glow-lg"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/verify/demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass hover:bg-white/[0.08] text-white font-semibold text-sm transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                Verify a Product
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-end animate-fade-up-delay-2">
            <HeroMockCard />
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative max-w-6xl mx-auto mt-24">
          <div className="glass rounded-3xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {STATS.map(([value, label]) => (
              <div key={label} className="px-6 py-7 text-center">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-stellar-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Built for trust
            </p>
            <h2 className="font-display text-display-sm font-bold text-white">
              Provenance infrastructure,
              <span className="text-slate-500"> end to end.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group glass rounded-3xl p-7 hover:bg-white/[0.06] transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-stellar-600/15 border border-stellar-500/20 flex items-center justify-center mb-5 group-hover:border-stellar-400/40 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="w-6 h-6 text-stellar-300" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative py-24 px-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-stellar-800/25 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-stellar-400 text-sm font-semibold tracking-widest uppercase mb-4">
              How it works
            </p>
            <h2 className="font-display text-display-sm font-bold text-white">
              Origin to shelf, in three moves.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} className="relative glass rounded-3xl p-8">
                {/* Connector arrow between cards */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-5 z-10 w-10 h-10 -translate-y-1/2 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-stellar-500" />
                  </div>
                )}
                <p className="font-display text-5xl font-bold text-white/[0.07] absolute top-6 right-7">
                  {n}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-stellar-600 flex items-center justify-center mb-6 shadow-glow">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stellar-600 via-stellar-700 to-indigo-800 px-8 py-16 sm:px-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative">
              <h2 className="font-display text-display-sm font-bold text-white mb-4">
                Start tracing your supply chain.
              </h2>
              <p className="text-stellar-100/80 max-w-xl mx-auto mb-10">
                Register your first batch in minutes. All you need is a Freighter
                wallet — the chain handles the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-stellar-800 font-semibold text-sm hover:bg-stellar-50 transition-colors"
                >
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Get Freighter
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-5 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.svg" alt="" className="w-7 h-7 rounded-lg" />
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  Lineage
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Supply chain provenance and anti-counterfeiting, sealed on the
                Stellar blockchain.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
              <div>
                <p className="text-white font-semibold mb-4">Product</p>
                <ul className="space-y-3 text-slate-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                  <li><Link to="/verify/demo" className="hover:text-white transition-colors">Verify a product</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Actors</p>
                <ul className="space-y-3 text-slate-400">
                  <li><Link to="/login" className="hover:text-white transition-colors">Sign in</Link></li>
                  <li><Link to="/dashboard/batches" className="hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Network</p>
                <ul className="space-y-3 text-slate-400">
                  <li>
                    <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Stellar
                    </a>
                  </li>
                  <li>
                    <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Explorer
                    </a>
                  </li>
                  <li>
                    <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Freighter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} Lineage. Built on Stellar · Testnet.
            </p>
            <p className="text-slate-600 text-xs font-mono">soroban · ipfs · ed25519</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
