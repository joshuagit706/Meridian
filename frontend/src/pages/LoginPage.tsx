import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle, Loader2, Wallet, ExternalLink } from 'lucide-react';
import { useFreighter } from '../hooks/useFreighter';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Account, TransactionBuilder, Networks, Operation, Asset, Memo } from '@stellar/stellar-sdk';

const NETWORK_PASSPHRASE =
  import.meta.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET;

function truncateAddr(addr: string): string {
  if (!addr || addr.length <= 12) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-8)}`;
}

type LoginStep = 'idle' | 'connecting' | 'fetching-challenge' | 'signing' | 'verifying' | 'done' | 'error';

export function LoginPage() {
  const navigate = useNavigate();
  const { actor, login } = useAuth();
  const { publicKey, connected, freighterAvailable, loading: freighterLoading, connect, signTx } = useFreighter();
  const [step, setStep] = useState<LoginStep>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Already logged in — redirect to dashboard
  useEffect(() => {
    if (actor) {
      navigate('/dashboard/batches', { replace: true });
    }
  }, [actor, navigate]);

  async function handleAuth() {
    if (!publicKey || !connected) return;
    setErrorMsg(null);

    try {
      // 1. Fetch challenge
      setStep('fetching-challenge');
      const { challenge } = await api.getChallenge(publicKey);

      // 2. Build a minimal Stellar transaction with the challenge as memo
      setStep('signing');
      // We build a fee-bump or dummy tx just to carry a memo for signing
      // Use a simple payment to self with memo = challenge (truncated to 28 bytes for TEXT memo)
      const memoText = challenge.slice(0, 28);

      // Fetch account to get sequence number — use Horizon testnet
      let sequenceNumber = '0';
      try {
        const horizonRes = await fetch(
          `https://horizon-testnet.stellar.org/accounts/${publicKey}`
        );
        if (horizonRes.ok) {
          const accData = await horizonRes.json();
          sequenceNumber = accData.sequence;
        }
      } catch {
        // If we can't fetch, use a dummy sequence
        sequenceNumber = '0';
      }

      const account = new Account(publicKey, sequenceNumber);
      const tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.payment({
            destination: publicKey,
            asset: Asset.native(),
            amount: '0.0000001',
          })
        )
        .addMemo(Memo.text(memoText))
        .setTimeout(30)
        .build();

      const signedXdr = await signTx(tx.toXDR(), NETWORK_PASSPHRASE);

      // 3. Verify with backend
      setStep('verifying');
      const { token, actor: newActor } = await api.verifySignature(
        publicKey,
        challenge,
        signedXdr
      );

      login(newActor, token);
      setStep('done');
      navigate('/dashboard/batches', { replace: true });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Authentication failed');
      setStep('error');
    }
  }

  const stepLabel: Record<LoginStep, string> = {
    idle: '',
    connecting: 'Connecting to Freighter…',
    'fetching-challenge': 'Fetching authentication challenge…',
    signing: 'Please approve in Freighter…',
    verifying: 'Verifying signature…',
    done: 'Authenticated!',
    error: 'Authentication failed',
  };

  const isBusy = ['connecting', 'fetching-challenge', 'signing', 'verifying'].includes(step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-stellar-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stellar-600 shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lineage</h1>
          <p className="text-stellar-300 mt-2 text-sm">
            Sign in with your Stellar wallet to access the actor dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-stellar-600 to-stellar-500" />
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-500 text-sm mb-6">
              Connect your Freighter wallet to authenticate via Stellar signature.
            </p>

            {/* Freighter not available */}
            {freighterAvailable === false && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      Freighter not detected
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Install the Freighter browser extension to continue.
                    </p>
                    <a
                      href="https://freighter.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-yellow-800 underline hover:text-yellow-900"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Install Freighter
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Connected address */}
            {connected && publicKey && (
              <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-700 font-medium">Wallet connected</p>
                    <p className="font-mono text-sm text-emerald-900 truncate mt-0.5">
                      {truncateAddr(publicKey)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {errorMsg && step === 'error' && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Authentication error</p>
                    <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step status */}
            {isBusy && (
              <div className="mb-5 p-3 bg-stellar-50 border border-stellar-200 rounded-xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-stellar-600 animate-spin flex-shrink-0" />
                <p className="text-sm text-stellar-800 font-medium">{stepLabel[step]}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!connected ? (
                <button
                  onClick={connect}
                  disabled={freighterLoading || freighterAvailable === false || freighterAvailable === null}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-stellar-600 hover:bg-stellar-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {freighterLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wallet className="w-5 h-5" />
                  )}
                  {freighterLoading ? 'Connecting…' : 'Connect Freighter Wallet'}
                </button>
              ) : (
                <button
                  onClick={handleAuth}
                  disabled={isBusy}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-stellar-600 hover:bg-stellar-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {isBusy ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                  {isBusy ? stepLabel[step] : 'Authenticate with Stellar Signature'}
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">or</span>
              </div>
            </div>

            <Link
              to="/verify/demo"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Scan a product QR code
            </Link>
          </div>
        </div>

        <p className="text-center text-stellar-400 text-xs mt-6">
          No account needed · Wallet signatures never leave your device
        </p>
      </div>
    </div>
  );
}
