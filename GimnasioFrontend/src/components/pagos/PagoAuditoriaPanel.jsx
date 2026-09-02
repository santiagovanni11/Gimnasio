import { formatoMoneda } from "../../utils/pagos";
import { resumenPagosAuditoria } from "../../utils/pagosMetadata";

function PagoAuditoriaPanel({ pagos = [] }) {
  const eventos = resumenPagosAuditoria(pagos);

  return (
    <div className="content-card" style={{ margin: "1rem 0" }}>
      <h4>Detalle y auditoría</h4>

      {eventos.length === 0 ? (
        <p className="dialogo-mensaje">Sin movimientos recientes.</p>
      ) : (
        eventos.map(({ pago, eventos: lista }) => (
          <div key={pago.id} style={{ borderBottom: "1px solid #e8e8e8", padding: "0.5rem 0" }}>
            <div className="ticket-row">
              <span>{pago.socioNombre} {pago.socioApellido}</span>
              <strong>{formatoMoneda(Number(pago.monto || 0))}</strong>
            </div>
            {lista.length === 0 ? (
              <p className="dialogo-mensaje">Sin auditoría para este pago.</p>
            ) : (
              <ul style={{ margin: "0.5rem 0 0 1rem", padding: 0 }}>
                {lista.slice(0, 3).map((evento) => (
                  <li key={evento.id} style={{ marginBottom: "0.35rem" }}>
                    {evento.accion}: {evento.detalle}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PagoAuditoriaPanel;
