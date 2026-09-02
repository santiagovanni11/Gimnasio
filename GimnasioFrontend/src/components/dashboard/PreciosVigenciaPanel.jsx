import { formatoMoneda } from "../../utils/pagos";

function PreciosVigenciaPanel({ planes = [] }) {
  const activos = planes.filter((plan) => plan.activo !== false);
  const promedio = activos.length
    ? activos.reduce((sum, plan) => sum + Number(plan.precio1Mes || 0), 0) / activos.length
    : 0;
  const masCostoso = activos.reduce((max, plan) => {
    const precio = Number(plan.precio1Mes || 0);
    return precio > Number(max.precio1Mes || 0) ? plan : max;
  }, activos[0] || { nombre: "—", precio1Mes: 0 });

  const detalle = activos.map((plan) => ({
    nombre: plan.nombre || "Plan",
    precio: Number(plan.precio1Mes || 0),
  }));

  return (
    <div
      className="content-card"
      style={{
        margin: "1rem 0",
        background: "linear-gradient(180deg, rgba(22, 27, 34, 0.96), rgba(16, 19, 24, 0.96))",
        borderColor: "var(--line)",
        boxShadow: "var(--sombra-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          <h4 style={{ margin: 0, color: "var(--texto)", fontSize: "1rem" }}>Precios y vigencia</h4>
        </div>
        <span className="status-active" style={{ padding: "4px 8px", fontSize: "11px" }}>Activos</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
        <div className="ticket-row" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--line)" }}>
          <span>Planes activos</span>
          <strong>{activos.length}</strong>
        </div>
        <div className="ticket-row" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--line)" }}>
          <span>Precio medio</span>
          <strong>{formatoMoneda(promedio)}</strong>
        </div>
        <div
          className="ticket-row"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "var(--line)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "0.2rem",
          }}
        >
          <span>Más caro</span>
          <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--texto)" }}>
            {masCostoso?.nombre || "—"}
          </strong>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {detalle.length === 0 ? (
          <p className="dialogo-mensaje">Todavía no hay planes activos.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "0.9rem", color: "var(--texto)" }}>
            {detalle.map((item) => (
              <li key={item.nombre} style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
                  {item.nombre}
                </span>
                <strong style={{ color: "var(--texto)" }}>{formatoMoneda(item.precio)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PreciosVigenciaPanel;
