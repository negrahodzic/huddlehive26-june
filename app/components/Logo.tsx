export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      {/* Map pin */}
      <path
        d="M12 1.5c-4.42 0-8 3.46-8 7.73 0 5.2 6.78 12.4 7.45 13.1a.75.75 0 0 0 1.1 0C13.22 21.63 20 14.43 20 9.23 20 4.96 16.42 1.5 12 1.5Z"
        fill="#c8862e"
      />
      {/* Document inside */}
      <rect x="8" y="5.4" width="8" height="9" rx="1.3" fill="#fbf6ec" />
      <rect x="9.6" y="7.4" width="3" height="1.1" rx="0.55" fill="#c8862e" />
      <rect x="9.6" y="9.4" width="4.8" height="0.9" rx="0.45" fill="#d4a04b" />
      <rect x="9.6" y="11" width="4.8" height="0.9" rx="0.45" fill="#d4a04b" />
      <rect x="9.6" y="12.6" width="3.4" height="0.9" rx="0.45" fill="#d4a04b" />
    </svg>
  );
}
