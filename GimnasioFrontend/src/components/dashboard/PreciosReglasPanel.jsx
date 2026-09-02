import { formatoMoneda } from "../../utils/pagos";
import { calcularImpactoCambio } from "../../utils/simuladorPrecios";

function PreciosReglasPanel({ planes = [], membresias = [] }) {
  const ranking = planes
    .filter((plan) => plan.activo !== false)
    .map((plan) => {
      const impacto = calcularImpactoCambio({ plan, valoresNuevos: plan, membresias });
      return {
        nombre: plan.nombre || "Plan",
        afectados: impacto.afectados,
        estimado: impacto.diferenciaMensual,
      };
    })
    .sort((a, b) => Math.abs(b.estimado) - Math.abs(a.estimado));

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
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--info)", display: "inline-block" }} />
          <h4 style={{ margin: 0, color: "var(--texto)", fontSize: "1rem" }}>Reglas y impacto</h4>
        </div>
        <span className="status-inactive" style={{ padding: "4px 8px", fontSize: "11px" }}>Operación</span>
      </div>

      {ranking.length === 0 ? (
        <p className="dialogo-mensaje">No hay planes activos para evaluar impacto.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "0.9rem", color: "var(--texto)" }}>
          {ranking.map((item) => (
            <li key={item.nombre} style={{ marginBottom: "0.75rem", paddingLeft: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--info)" }} />
                  <strong>{item.nombre}</strong>
                </div>
                <span style={{ color: "var(--texto-muted)", fontSize: "0.8rem" }}>
                  {item.afectados} activo{item.afectados === 1 ? "" : "s"}
                </span>
              </div>
              <div style={{ color: "var(--texto-dim)", fontSize: "0.8rem", marginTop: "0.15rem", marginLeft: "1.2rem" }}>
                Impacto estimado: {formatoMoneda(Math.abs(item.estimado))}/mes
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreciosReglasPanel;
