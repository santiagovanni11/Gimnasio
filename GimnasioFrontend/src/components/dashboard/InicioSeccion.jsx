// =========================================================
// INICIO — Tarjeta de bienvenida y métricas principales
// =========================================================

function InicioSeccion({
  mensaje,
  sociosActivosCount,
  membresiasActivasCount,
  pagosRegistradosCount,
}) {
  const metricas = [
    { etiqueta: "Socios", valor: sociosActivosCount },
    { etiqueta: "Membresías", valor: membresiasActivasCount },
    { etiqueta: "Pagos", valor: pagosRegistradosCount },
    { etiqueta: "Clases", valor: "—" },
  ];

  return (
    <>
      <section className="welcome-card">
        <div>
          <span className="eyebrow">SISTEMA DE GESTIÓN</span>

          <h2>Todo tu gimnasio, desde un solo lugar.</h2>

          <p>
            Administrá socios, membresías, pagos, clases y
            asistencia desde este panel.
          </p>
        </div>

        <div className="welcome-mark">GYM</div>
      </section>

      <section className="stats-grid">
        {metricas.map((metrica) => (
          <div className="stat-card" key={metrica.etiqueta}>
            <span>{metrica.etiqueta}</span>

            <strong>{metrica.valor || "—"}</strong>

            <small>Datos disponibles</small>
          </div>
        ))}
      </section>

      {mensaje && (
        <div className="info-message">{mensaje}</div>
      )}
    </>
  );
}

export default InicioSeccion;
