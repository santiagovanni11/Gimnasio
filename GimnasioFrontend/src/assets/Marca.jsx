// =========================================================
// MARCA — Identidad visual FORZA (logo + logotipo)
// SVG inline: sin dependencias externas ni peticiones de red.
// =========================================================

export function Logo({ size = 40, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="FORZA"
    >
      <rect width="48" height="48" rx="13" fill="url(#forzaGrad)" />
      <rect x="9.5" y="19.5" width="6.5" height="9" rx="3.2" fill="#0b0d12" />
      <rect x="32" y="19.5" width="6.5" height="9" rx="3.2" fill="#0b0d12" />
      <rect x="17.5" y="22.4" width="13" height="3.2" rx="1.6" fill="#0b0d12" />
      <defs>
        <linearGradient id="forzaGrad" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#6fe39c" />
          <stop offset="1" stopColor="#1f9e5c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logotipo({ size = 22 }) {
  return (
    <span className="brand-wordmark" style={{ fontSize: size }}>
      FORZA
    </span>
  );
}
