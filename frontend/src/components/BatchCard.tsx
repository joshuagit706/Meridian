import { Package, ArrowRight, Eye, Calendar, User, Link } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Batch } from '../types';
import { clsx } from 'clsx';

interface BatchCardProps {
  batch: Batch;
  onTransfer?: () => void;
  onView?: () => void;
}

function truncateAddr(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function BatchCard({ batch, onTransfer, onView }: BatchCardProps) {
  const productName =
    typeof batch.metadata?.productName === 'string'
      ? batch.metadata.productName
      : typeof batch.metadata?.name === 'string'
      ? batch.metadata.name
      : 'Unnamed Product';

  const formattedDate = (() => {
    try {
      return format(parseISO(batch.createdAt), 'MMM d, yyyy');
    } catch {
      return batch.createdAt;
    }
  })();

  const holderName =
    batch.producer?.name ?? truncateAddr(batch.currentHolder);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-stellar-600 to-stellar-500" />

      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-stellar-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-stellar-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate leading-tight">
                {productName}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                {truncateAddr(batch.chainId)}
              </p>
            </div>
          </div>

          <span
            className={clsx(
              'flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              batch.events.length > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            )}
          >
            {batch.events.length > 0 ? 'In Transit' : 'Origin'}
          </span>
        </div>

        {/* Details grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{holderName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{batch.events.length} event{batch.events.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          )}
          {onTransfer && (
            <button
              onClick={onTransfer}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stellar-600 text-sm font-medium text-white hover:bg-stellar-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Transfer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
