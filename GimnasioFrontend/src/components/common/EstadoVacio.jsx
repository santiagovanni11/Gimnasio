// =========================================================
// EstadoVacio.jsx — Ilustración + mensaje para listas vacías
// Cada dominio tiene su propia ilustración (trazo limpio),
// así el vacío nunca se ve como un placeholder genérico.
// =========================================================

const ILUSTRACIONES = {
  socios: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="9" />
      <path d="M9 51a15 15 0 0 1 30 0" />
      <circle cx="44" cy="28" r="6.5" />
      <path d="M38 51a13 13 0 0 1 22-9.5" />
    </svg>
  ),
  usuarios: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="22" cy="22" r="10" />
      <path d="M6 52a16 16 0 0 1 32 0" />
      <circle cx="46" cy="22" r="10" />
      <path d="M30 52a16 16 0 0 1 32 0" />
    </svg>
  ),
  pagos: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="18" width="44" height="28" rx="5" />
      <path d="M10 27h44M18 37h12" />
    </svg>
  ),
  precios: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 20h22l14 14v10a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" />
      <circle cx="28" cy="34" r="5" />
    </svg>
  ),
  membresias: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="18" width="44" height="28" rx="6" />
      <path d="M10 26h44M22 18v28" />
    </svg>
  ),
  clases: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="14" width="40" height="36" rx="5" />
      <path d="M12 24h40M22 11v6M42 11v6M22 36h9" />
    </svg>
  ),
  asistencias: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="20" />
      <path d="M23 32l6 6 12-13" />
    </svg>
  ),
  busqueda: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="28" r="14" />
      <path d="M39 39l13 13" />
    </svg>
  ),
};

function EstadoVacio({ tipo = "defecto", titulo, mensaje, accion }) {
  const ilustracion = ILUSTRACIONES[tipo] ?? ILUSTRACIONES.busqueda;

  return (
    <div className="estado-vacio">
      <div className="estado-vacio-ilustracion">{ilustracion}</div>
      {titulo && <h3>{titulo}</h3>}
      {mensaje && <p>{mensaje}</p>}
      {accion}
    </div>
  );
}

export default EstadoVacio;
