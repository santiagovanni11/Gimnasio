// =========================================================
// Iconos.jsx — Set de iconos de navegación (stroke, currentColor)
// SVG inline: sin dependencias externas.
// =========================================================

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconoInicio = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z" />
  </svg>
);

export const IconoSocios = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5.8M17 14a5.5 5.5 0 0 1 3.5 5" />
  </svg>
);

export const IconoMembresias = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7.5 14h3" />
  </svg>
);

export const IconoPrecios = (p) => (
  <svg {...base} {...p}>
    <path d="M5 7h9M16 7h3M5 12h3M12 12h7M5 17h11M18 17h1" />
    <circle cx="14" cy="7" r="2" />
    <circle cx="9.5" cy="12" r="2" />
    <circle cx="15.5" cy="17" r="2" />
  </svg>
);

export const IconoUsuarios = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5c0 4.2-2.9 7.5-7 8.5C7.9 18.5 5 15.2 5 11V6z" />
    <path d="M9.5 11.5l1.8 1.8 3.4-3.6" />
  </svg>
);

export const IconoPagos = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8.5a2.5 2.5 0 0 1 2.5-2.5H18a2.5 2.5 0 0 1 2.5 2.5v2H3z" />
    <path d="M3 11h19v6.5A2.5 2.5 0 0 1 19.5 20H5.5A2.5 2.5 0 0 1 3 17.5z" />
    <path d="M16 14.5h2" />
  </svg>
);

export const IconoClases = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3M8 13h3M13 13h3M8 16.5h3" />
  </svg>
);

export const IconoAsistencias = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.2 12.2l2.6 2.6 4.8-5" />
  </svg>
);

export const IconoCerrarSesion = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 12H3M6 9l-3 3 3 3" />
  </svg>
);
