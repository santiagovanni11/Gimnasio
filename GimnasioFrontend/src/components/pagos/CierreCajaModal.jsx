import { useState } from "react";
import { formatoMoneda } from "../../utils/pagos";
import { calcularCierreCaja, exportarCierrePdf } from "../../utils/caja";
import { hoyISO } from "../../utils/fechas";
import { obtenerRol } from "../../services/almacenSesion";

/**
 * Modal de cierre de caja diario: totales por forma de pago
 * para la fecha seleccionada, con exportación a PDF.
 */
export default function CierreCajaModal({ pagos = [], onClose }) {
  const [fecha, setFecha] = useState(hoyISO());

  const cierre = calcularCierreCaja(pagos, fecha);
  const responsable = obtenerRol() || "-";

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">CIERRE DE CAJA</span>
            <h3>Resumen diario</h3>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-ticket-body">
          <div className="ticket-row">
            <span>Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
            />
          </div>
          <div className="ticket-row">
            <span>Responsable</span>
            <strong>{responsable}</strong>
          </div>

          {cierre.formas.length === 0 ? (
            <p className="empty-state">
              No hay cobros registrados para esta fecha.
            </p>
          ) : (
            cierre.formas.map((item) => (
              <div className="ticket-row" key={item.forma}>
                <span>
                  {item.nombre} ({item.cantidad})
                </span>
                <strong>{formatoMoneda(item.monto)}</strong>
              </div>
            ))
          )}

          <div className="ticket-row total-row">
            <span>Total del día</span>
            <strong>{formatoMoneda(cierre.total)}</strong>
          </div>
        </div>

        <div className="payment-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="primary-small-button"
            disabled={!cierre.cantidad}
            onClick={() => exportarCierrePdf(cierre, responsable)}
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
