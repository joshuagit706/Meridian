import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Package,
  User,
  Calendar,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import * as api from '../services/api';
import { Timeline } from '../components/Timeline';
import { Badge } from '../components/Badge';
import type { Role } from '../types';

const STELLAR_EXPLORER =
  import.meta.env.VITE_STELLAR_EXPLORER ||
  'https://stellar.expert/explorer/testnet';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || '';

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMMM d, yyyy');
  } catch {
    return iso;
  }
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500 capitalize flex-shrink-0 w-36">
        {label.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
      </dt>
      <dd className="text-sm font-medium text-gray-900 text-right break-words min-w-0">
        {value}
      </dd>
    </div>
  );
}

export function VerifyPage() {
  const { batchId } = useParams<{ batchId: string }>();

  const {
    data: batch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => api.getBatch(batchId!),
    enabled: !!batchId,
    retry: 1,
  });

  if (!batchId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900">Invalid QR Code</h1>
          <p className="text-gray-500 mt-2">No batch ID found in this URL.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-stellar-600 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Verifying provenance…</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fetching data from Stellar blockchain
          </p>
        </div>
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-sm w-full">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900">Batch Not Found</h2>
            <p className="text-red-700 text-sm mt-2">
              This QR code may be invalid, expired, or the batch has not been registered
              yet.
            </p>
            {error instanceof Error && (
              <p className="text-red-500 text-xs mt-3 font-mono bg-red-100 rounded-lg p-2">
                {error.message}
              </p>
            )}
            <Link
              to="/"
              className="inline-block mt-4 text-sm font-medium text-red-700 underline hover:text-red-900"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productName =
    typeof batch.metadata?.productName === 'string'
      ? batch.metadata.productName
      : typeof batch.metadata?.name === 'string'
      ? batch.metadata.name
      : 'Product';

  const metadataEntries = batch.metadata
    ? Object.entries(batch.metadata).filter(
        ([k]) => !['productName', 'name'].includes(k)
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-stellar-900 to-slate-900 pb-12">
      {/* Top verified banner */}
      <div className="bg-gradient-to-r from-stellar-700 to-stellar-600 px-4 py-4 text-center">
        <a
          href={`${STELLAR_EXPLORER}/contract/${CONTRACT_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-semibold px-5 py-2.5 rounded-full shadow-lg text-sm"
        >
          <CheckCircle className="w-5 h-5" />
          Verified on Stellar
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
        <p className="text-stellar-200 text-xs mt-2">
          Immutable record — contract verified on Stellar testnet
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Product hero card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-stellar-600 to-emerald-500" />
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-stellar-50 flex items-center justify-center">
                <Package className="w-7 h-7 text-stellar-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {productName}
                </h1>
                <p className="text-xs text-gray-500 font-mono mt-1 break-all">
                  Batch: {batch.chainId}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              {/* Producer */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Producer</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {batch.producer?.name ?? 'Unknown'}
                    </p>
                    {batch.producer?.role && (
                      <Badge role={batch.producer.role as Role} />
                    )}
                  </div>
                </div>
              </div>

              {/* Registered date */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Registered</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {formatDate(batch.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata section */}
        {metadataEntries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-stellar-600" />
                Product Details
              </h2>
            </div>
            <dl className="px-5 pb-4">
              {metadataEntries.map(([key, val]) => (
                <MetadataItem
                  key={key}
                  label={key}
                  value={typeof val === 'string' ? val : JSON.stringify(val)}
                />
              ))}
            </dl>
          </div>
        )}

        {/* Chain of Custody */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Chain of Custody
              <span className="ml-auto text-xs font-normal text-gray-500">
                {batch.events.length + 1} step{batch.events.length !== 0 ? 's' : ''}
              </span>
            </h2>
            <Timeline
              events={batch.events}
              originActor={batch.producer}
              createdAt={batch.createdAt}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-slate-400 text-xs">
            Scan powered by{' '}
            <span className="font-semibold text-stellar-400">Lineage</span> ·
            Stellar Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
