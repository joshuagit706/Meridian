interface LogoProps {
  className?: string;
}

/**
 * Lineage mark — a chain of custody tracing an "L": two origin nodes
 * linked down, then across to a verified (checked) node.
 */
export function Logo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path d="M14 17.5 V 27.5" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M19.5 33 H 23.5" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="12" r="5" stroke="#2563eb" strokeWidth="4" />
      <circle cx="14" cy="33" r="5" stroke="#2563eb" strokeWidth="4" />
      <circle cx="32" cy="33" r="8.5" fill="#2563eb" />
      <path
        d="M28.2 33.2 l2.6 2.6 5-5.6"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
