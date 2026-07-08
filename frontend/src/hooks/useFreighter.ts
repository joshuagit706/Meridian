import { useState, useEffect, useCallback } from 'react';

export function useFreighter() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freighterAvailable, setFreighterAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    import('@stellar/freighter-api')
      .then(({ isConnected, getAddress }) => {
        setFreighterAvailable(true);
        isConnected().then(({ isConnected: ok }) => {
          if (ok) {
            getAddress().then(({ address, error: err }) => {
              if (address && !err) {
                setPublicKey(address);
                setConnected(true);
              }
            });
          }
        });
      })
      .catch(() => {
        setFreighterAvailable(false);
      });
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { requestAccess } = await import('@stellar/freighter-api');
      const { address, error: err } = await requestAccess();
      if (err) throw new Error(err.message);
      if (!address) throw new Error('No public key returned');
      setPublicKey(address);
      setConnected(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  const signTx = useCallback(
    async (txXdr: string, networkPassphrase: string): Promise<string> => {
      const { signTransaction } = await import('@stellar/freighter-api');
      const { signedTxXdr, error: err } = await signTransaction(txXdr, {
        networkPassphrase,
      });
      if (err) throw new Error(err.message);
      if (!signedTxXdr) throw new Error('No signed transaction returned');
      return signedTxXdr;
    },
    []
  );

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setConnected(false);
    localStorage.removeItem('token');
    localStorage.removeItem('actor');
  }, []);

  return {
    publicKey,
    connected,
    loading,
    error,
    freighterAvailable,
    connect,
    signTx,
    disconnect,
  };
}
