import { useMemo, useState } from "react";
import { ESTADO_PAGO, formatoMoneda, formaPagoTexto } from "../../utils/pagos";
import { conciliacionPagos } from "../../utils/pagosMetadata";

function PagosRechazadosPanel({ pagos = [], onReintentar, onCancelarRevision, onDelete }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [pagoEnRevision, setPagoEnRevision] = useState(null);

  const rechazados = useMemo(() => {
    const base = pagos.filter((pago) => Number(pago.estado) === ESTADO_PAGO.RECHAZADO);

    return base.filter((pago) => {
      const texto = `${pago.socioNombre ?? ""} ${pago.socioApellido ?? ""} ${formaPagoTexto(pago.formaPago) ?? ""}`.toLowerCase();
      const coincide = texto.includes(busqueda.toLowerCase());
      if (!coincide) return false;

      if (filtro === "todos") return true;
      if (filtro === "revision") return Number(pago.id) === Number(pagoEnRevision);
      return true;
    });
  }, [pagos, busqueda, filtro, pagoEnRevision]);

  const conciliacion = conciliacionPagos(pagos);

  return (
    <div className="content-card" style={{ margin: "1rem 0" }}>
      <h4>Pagos rechazados y conciliación</h4>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
        <div className="ticket-row"><span>Rechazados</span><strong>{conciliacion.rechazados}</strong></div>
        <div className="ticket-row"><span>Aprobados</span><strong>{conciliacion.aprobados}</strong></div>
        <div className="ticket-row"><span>Pendientes</span><strong>{conciliacion.pendientes}</strong></div>
        <div className="ticket-row"><span>Conciliado</span><strong>{formatoMoneda(conciliacion.total)}</strong></div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div className="search-box" style={{ minWidth: "240px" }}>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por socio o método..."
          />
        </div>

        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="filter-select">
          <option value="todos">Todos</option>
          <option value="revision">En revisión</option>
        </select>
      </div>

      {rechazados.length === 0 ? (
        <p className="dialogo-mensaje">No hay pagos rechazados para revisar.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {rechazados.map((pago) => {
            const enRevision = Number(pago.id) === Number(pagoEnRevision);

            return (
              <li key={pago.id} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span>
                    {pago.socioNombre} {pago.socioApellido} · {formaPagoTexto(pago.formaPago)} · {formatoMoneda(Number(pago.monto || 0))}
                  </span>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {enRevision && (
                      <span className="status-warning" style={{ padding: "4px 8px" }}>Revisando</span>
                    )}

                    {!enRevision ? (
                      <>
                        <button
                          type="button"
                          className="primary-small-button"
                          onClick={() => setPagoEnRevision(pago.id)}
                        >
                          Revisar
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => onDelete?.(pago)}
                        >
                          Borrar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="primary-small-button"
                          onClick={() => {
                            setPagoEnRevision(null);
                            onReintentar?.(pago);
                          }}
                        >
                          Poner en pendientes
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            setPagoEnRevision(null);
                            onCancelarRevision?.(pago);
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => onDelete?.(pago)}
                        >
                          Borrar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PagosRechazadosPanel;
