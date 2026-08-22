// =========================================================
// ESTADOS DE LISTA — Mensajes comunes de secciones
// =========================================================

function EstadosLista({
  cargando,
  error,
  total = null,
  filtrados = null,
  mensajeCargando = "Cargando...",
  mensajeVacio = "No hay datos registrados.",
  mensajeSinResultado = "No se encontraron resultados.",
}) {
  if (cargando) {
    return <div className="info-message">{mensajeCargando}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (total !== null && total === 0) {
    return <div className="empty-state">{mensajeVacio}</div>;
  }

  if (
    filtrados !== null &&
    total !== null &&
    total > 0 &&
    filtrados === 0
  ) {
    return <div className="empty-state">{mensajeSinResultado}</div>;
  }

  return null;
}

export default EstadosLista;
