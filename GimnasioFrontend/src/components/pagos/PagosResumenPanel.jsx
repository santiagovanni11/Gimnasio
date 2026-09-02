import { ESTADO_PAGO, formatoMoneda } from "../../utils/pagos";

function PagosResumenPanel({ pagos = [] }) {
  const totals = {
    aprobados: pagos
      .filter((pago) => Number(pago.estado) === ESTADO_PAGO.APROBADO)
      .reduce((sum, pago) => sum + Number(pago.monto || 0), 0),
    rechazados: pagos
      .filter((pago) => Number(pago.estado) === ESTADO_PAGO.RECHAZADO)
      .reduce((sum, pago) => sum + Number(pago.monto || 0), 0),
    pendientes: pagos
      .filter((pago) => Number(pago.estado) === ESTADO_PAGO.PENDIENTE)
      .reduce((sum, pago) => sum + Number(pago.monto || 0), 0),
  };

  const resumen = [
    { label: "Aprobados", valor: totals.aprobados, color: "var(--exito)" },
    { label: "Rechazados", valor: totals.rechazados, color: "var(--peligro)" },
    { label: "Pendientes", valor: totals.pendientes, color: "var(--aviso)" },
    { label: "Total caja", valor: totals.aprobados + totals.pendientes, color: "var(--texto)" },
  ];

  return (
    <div className="content-card" style={{ margin: "1rem 0", background: "var(--surface)", borderColor: "var(--line)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <h4 style={{ margin: 0, color: "var(--texto)" }}>Resumen financiero</h4>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.75rem" }}>
        {resumen.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              padding: "0.8rem 0.9rem",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--texto-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {item.label}
            </span>
            <strong style={{ fontSize: "1.05rem", color: item.color, lineHeight: 1.2 }}>
              {formatoMoneda(item.valor)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PagosResumenPanel;
