import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
  esAnulado,
} from "../../utils/pagos";
import { getPlanNombre, getPlanBadgeClase } from "../../utils/planes";

export default function TablaPagos({
  pagos,
  membresias = [],
  saldoPorPago,
  onDelete,
  onViewDetail,
  onCambiarEstado,
}) {
  if (!pagos.length) {
    return <div className="empty-state">No hay pagos registrados.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Socio</th>
            <th>Membresía</th>
            <th>Monto</th>
            <th>Pagado</th>
            <th>Forma</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((pago) => {
            const planNombre = getPlanNombre(pago, membresias);
            const saldoInfo = saldoPorPago?.get(Number(pago.id));
            return (
            <tr key={pago.id}>
              <td>
                {pago.socioNombre} {pago.socioApellido}
              </td>
              <td>
                <span className={getPlanBadgeClase(planNombre)}>
                  {planNombre}
                </span>
              </td>
              <td>{formatoMoneda(pago.monto)}</td>
              <td>
                {saldoInfo ? (
                  saldoInfo.saldo > 0 ? (
                    <span
                      className="status-warning"
                      title={`Saldo pendiente: ${formatoMoneda(saldoInfo.saldo)}`}
                    >
                      {formatoMoneda(saldoInfo.pagado)}
                    </span>
                  ) : (
                    formatoMoneda(saldoInfo.pagado)
                  )
                ) : (
                  "-"
                )}
              </td>
              <td>{formaPagoTexto(pago.formaPago)}</td>
              <td>
                {pago.fechaPago
                  ? new Date(pago.fechaPago).toLocaleDateString("es-AR")
                  : "-"}
              </td>
              <td>
                <span
                  className={
                    esAnulado(pago)
                      ? "status-inactive"
                      : Number(pago.estado) === 2
                      ? "status-active"
                      : Number(pago.estado) === 1
                      ? "status-warning"
                      : Number(pago.estado) === 3
                      ? "status-rejected"
                      : "status-inactive"
                  }
                >
                  {estadoPagoTexto(pago.estado)}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="view-button"
                    onClick={() => onViewDetail(pago)}
                    title="Ver detalle"
                  >
                    Ver
                  </button>
                  {Number(pago.estado) === 1 && (
                    <button
                      type="button"
                      className="approve-button"
                      onClick={() => onCambiarEstado(pago, 2)}
                      title="Aprobar pago"
                    >
                      Aprobar
                    </button>
                  )}
                  {!esAnulado(pago) && (
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => onDelete(pago)}
                      title="Anular pago"
                    >
                      Anular
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}