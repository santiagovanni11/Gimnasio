import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
} from "../../utils/pagos";
import { getPlanNombre } from "../../utils/planes";
import { exportarComprobantePagoPdf } from "../../utils/exportar/comprobantePagoPdf";

export default function DetallePagoModal({ pago, membresias = [], saldoInfo, onClose }) {
  if (!pago) {
    return null;
  }

  const planNombre = getPlanNombre(pago, membresias);

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">DETALLE DE PAGO</span>
            <h3>Pago #{pago.id}</h3>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-ticket-body">
          <div className="ticket-row">
            <span>Socio</span>
            <strong>
              {pago.socioNombre} {pago.socioApellido}
            </strong>
          </div>
          <div className="ticket-row">
            <span>Membresía</span>
            <strong>{getPlanNombre(pago, membresias)}</strong>
          </div>
          <div className="ticket-row">
            <span>Monto</span>
            <strong>{formatoMoneda(pago.monto)}</strong>
          </div>
          {saldoInfo && (
            <>
              <div className="ticket-row">
                <span>Pagado de la membresía</span>
                <strong>{formatoMoneda(saldoInfo.pagado)}</strong>
              </div>
              <div className="ticket-row">
                <span>Saldo pendiente</span>
                <strong>
                  {saldoInfo.saldo > 0 ? (
                    <span className="status-warning">
                      {formatoMoneda(saldoInfo.saldo)}
                    </span>
                  ) : (
                    <span className="status-active">Sin deuda</span>
                  )}
                </strong>
              </div>
            </>
          )}
          <div className="ticket-row">
            <span>Forma de pago</span>
            <strong>{formaPagoTexto(pago.formaPago)}</strong>
          </div>
          <div className="ticket-row">
            <span>Fecha</span>
            <strong>
              {pago.fechaPago
                ? new Date(pago.fechaPago).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </strong>
          </div>
          <div className="ticket-row">
            <span>Estado</span>
            <strong>
              <span
                className={
                  Number(pago.estado) === 2
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
            </strong>
          </div>
          {pago.referencia && (
            <div className="ticket-row">
              <span>Referencia</span>
              <strong>{pago.referencia}</strong>
            </div>
          )}
          {pago.observaciones && (
            <div className="ticket-row">
              <span>Observaciones</span>
              <strong>{pago.observaciones}</strong>
            </div>
          )}
          {pago.registradoPor && (
            <div className="ticket-row">
              <span>Registrado por</span>
              <strong>{pago.registradoPor}</strong>
            </div>
          )}
          {pago.motivoAnulacion && (
            <div className="ticket-row">
              <span>Motivo de anulación</span>
              <strong>{pago.motivoAnulacion}</strong>
            </div>
          )}
        </div>

        <div className="payment-modal-actions">
          <button type="button" className="secondary-button" onClick={() => exportarComprobantePagoPdf(pago, planNombre)}>
            Descargar PDF
          </button>
          <button type="button" className="primary-small-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}