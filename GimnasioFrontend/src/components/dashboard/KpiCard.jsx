// KpiCard — Tarjeta de métrica con tendencia opcional.
export default function KpiCard({ etiqueta, valor, sub, tendencia, alerta }) {
  return (
    <div className={`kpi-card ${alerta ? "kpi-alerta" : ""}`}>
      <span className="kpi-etiqueta">{etiqueta}</span>
      <strong className="kpi-valor">{valor}</strong>
      <div className="kpi-pie">
        {tendencia && (
          <span className={`kpi-trend kpi-${tendencia.dir}`}>
            {tendencia.dir === "up" ? "▲" : "▼"} {tendencia.pct}%
          </span>
        )}
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}
