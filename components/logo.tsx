// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// Fosbury mark — a soft cluster of three overlapping discs in the brand palette
// (Clay-inspired). Thin cream separators keep the overlaps crisp.
// ─────────────────────────────────────────────────────────────────────────────

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Fosbury"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#fff4d6" strokeWidth="2">
        <circle cx="20" cy="15" r="9" fill="#ff3d8b" />
        <circle cx="14.5" cy="24.5" r="9" fill="#7c3aed" />
        <circle cx="25.5" cy="24.5" r="9" fill="#22d3a7" />
      </g>
    </svg>
  )
}
