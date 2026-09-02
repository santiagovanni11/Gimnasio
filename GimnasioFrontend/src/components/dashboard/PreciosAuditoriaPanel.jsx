function PreciosAuditoriaPanel({ planes = [], filasHistorial = [] }) {
  const historial = filasHistorial.length
    ? filasHistorial.slice(0, 4)
    : planes.map((plan) => ({
        nombrePlan: plan.nombre || "Plan",
        detalle: plan.activo === false ? "Pausado" : "Activo",
        fecha: "Sin cambio reciente",
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
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--aviso)", display: "inline-block" }} />
          <h4 style={{ margin: 0, color: "var(--texto)", fontSize: "1rem" }}>Historial y auditoría</h4>
        </div>
        <span className="status-warning" style={{ padding: "4px 8px", fontSize: "11px" }}>Registro</span>
      </div>

      {historial.length === 0 ? (
        <p className="dialogo-mensaje">Todavía no hay cambios registrados.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "0.9rem", color: "var(--texto)" }}>
          {historial.map((item, index) => (
            <li key={`${item.nombrePlan || "plan"}-${index}`} style={{ marginBottom: "0.7rem", paddingLeft: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--aviso)" }} />
                <strong>{item.nombrePlan || "Plan"}</strong>
                <span style={{ color: "var(--texto-muted)" }}>
                  {" · "}
                  {item.detalle || item.accion || "Cambio registrado"}
                </span>
              </div>
              <div style={{ color: "var(--texto-dim)", fontSize: "0.8rem", marginTop: "0.15rem", marginLeft: "1.2rem" }}>
                {item.fecha || item.creadoEn || "Sin fecha"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreciosAuditoriaPanel;
