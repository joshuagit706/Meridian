import { CheckCircle, MapPin, ExternalLink, FileText, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { ChainEvent, Actor } from '../types';
import { Badge } from './Badge';

interface TimelineProps {
  events: ChainEvent[];
  originActor?: Actor;
  createdAt?: string;
}

const STELLAR_EXPLORER =
  import.meta.env.VITE_STELLAR_EXPLORER ||
  'https://stellar.expert/explorer/testnet';

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return iso;
  }
}

function truncateHash(hash: string, len = 8): string {
  if (hash.length <= len * 2 + 3) return hash;
  return `${hash.slice(0, len)}…${hash.slice(-len)}`;
}

interface TimelineDotProps {
  color: 'green' | 'blue' | 'gold';
  icon: React.ReactNode;
}

function TimelineDot({ color, icon }: TimelineDotProps) {
  const colorMap = {
    green: 'bg-emerald-500 ring-emerald-100',
    blue: 'bg-stellar-600 ring-stellar-100',
    gold: 'bg-amber-500 ring-amber-100',
  };
  return (
    <div
      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ring-4 z-10 ${colorMap[color]}`}
    >
      <span className="text-white">{icon}</span>
    </div>
  );
}

export function Timeline({ events, originActor, createdAt }: TimelineProps) {
  const isLast = (index: number) => index === events.length - 1;

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {/* Origin node */}
        <li>
          <div className="relative pb-8">
            {events.length > 0 && (
              <span
                className="absolute left-4 top-9 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            )}
            <div className="relative flex items-start gap-4">
              <TimelineDot
                color="green"
                icon={<Package className="w-4 h-4" />}
              />
              <div className="min-w-0 flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-emerald-900 text-sm">
                    Batch Created
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Origin
                  </span>
                  {originActor && <Badge role={originActor.role} />}
                </div>
                {originActor && (
                  <p className="text-sm font-medium text-gray-800">
                    {originActor.name}
                  </p>
                )}
                {createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(createdAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </li>

        {/* Transfer events */}
        {events.map((event, index) => {
          const last = isLast(index);
          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {!last && (
                  <span
                    className="absolute left-4 top-9 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start gap-4">
                  <TimelineDot
                    color={last ? 'gold' : 'blue'}
                    icon={<CheckCircle className="w-4 h-4" />}
                  />
                  <div
                    className={`min-w-0 flex-1 rounded-xl p-4 border ${
                      last
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`font-semibold text-sm ${
                          last ? 'text-amber-900' : 'text-gray-900'
                        }`}
                      >
                        Custody Transfer
                      </span>
                      {last && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Current Holder
                        </span>
                      )}
                    </div>

                    {/* From → To */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        {event.fromActor ? (
                          <span className="font-medium text-gray-800">
                            {event.fromActor.name}
                          </span>
                        ) : (
                          <span className="font-mono text-gray-600 text-xs">
                            {truncateHash(event.fromAddr, 6)}
                          </span>
                        )}
                        {event.fromActor && <Badge role={event.fromActor.role} />}
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-1.5">
                        {event.toActor ? (
                          <span className="font-medium text-gray-800">
                            {event.toActor.name}
                          </span>
                        ) : (
                          <span className="font-mono text-gray-600 text-xs">
                            {truncateHash(event.toAddr, 6)}
                          </span>
                        )}
                        {event.toActor && <Badge role={event.toActor.role} />}
                      </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(event.eventTimestamp)}
                    </p>

                    {/* Links row */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {event.txHash && (
                        <a
                          href={`${STELLAR_EXPLORER}/tx/${event.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-stellar-600 hover:text-stellar-700 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Stellar Explorer
                        </a>
                      )}
                      {event.docIpfsUrl && (
                        <a
                          href={event.docIpfsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          View Document
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}

        {/* If no events yet, show a "pending" tail node */}
        {events.length === 0 && (
          <li>
            <div className="relative flex items-center gap-4 pl-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-amber-100 bg-amber-400 z-10">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-sm font-medium text-amber-800">
                  Current Holder — no transfers yet
                </span>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
