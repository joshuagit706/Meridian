import type { Role } from '../types';
import { clsx } from 'clsx';

interface BadgeProps {
  role: Role;
  size?: 'sm' | 'md';
}

const roleStyles: Record<Role, string> = {
  Producer: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Processor: 'bg-blue-100 text-blue-800 ring-blue-200',
  Distributor: 'bg-purple-100 text-purple-800 ring-purple-200',
  Retailer: 'bg-orange-100 text-orange-800 ring-orange-200',
  Auditor: 'bg-gray-100 text-gray-800 ring-gray-200',
  Admin: 'bg-red-100 text-red-800 ring-red-200',
};

export function Badge({ role, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full ring-1 ring-inset',
        roleStyles[role],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {role}
    </span>
  );
}
