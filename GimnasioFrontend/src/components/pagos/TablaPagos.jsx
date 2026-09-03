import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
  esAnulado,
} from "../../utils/pagos";
import { getPlanNombre, getPlanBadgeClase } from "../../utils/planes";
import EstadoVacio from "../common/EstadoVacio";

export default function TablaPagos({
  pagos,
  membresias = [],
  saldoPorPago,
  onDelete,
  onViewDetail,
  onCambiarEstado,
  onEditar,
}) {
  if (!pagos.length) {
    return (
      <EstadoVacio
        tipo="pagos"
        titulo="Sin pagos todavía"
        mensaje="Cuando registres un cobro aparecerá aquí, con su comprobante."
      />
    );
  }

  return (
    <div className="table-wrapper tabla-pagos">
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
              <td data-label="Socio">
                {pago.socioNombre} {pago.socioApellido}
              </td>
              <td data-label="Membresía">
                <span className={getPlanBadgeClase(planNombre)}>{planNombre}</span>
                {pago.referencia?.startsWith("AUTO-") && <span className="chip-auto">Renov. auto</span>}
              </td>
              <td data-label="Monto">{formatoMoneda(pago.monto)}</td>
              <td data-label="Pagado">
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
              <td data-label="Forma">{formaPagoTexto(pago.formaPago)}</td>
              <td data-label="Fecha">
                {pago.fechaPago
                  ? new Date(pago.fechaPago).toLocaleDateString("es-AR")
                  : "-"}
              </td>
              <td data-label="Estado">
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
              <td data-label="Acciones">
                <div className="table-actions">
                  <button
                    type="button"
                    className="view-button"
                    onClick={() => onViewDetail(pago)}
                    title="Ver detalle"
                  >
                    Ver
                  </button>
                  {!esAnulado(pago) && (
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => onEditar?.(pago)}
                      title="Editar monto, forma o estado del pago"
                    >
                      Editar
                    </button>
                  )}
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