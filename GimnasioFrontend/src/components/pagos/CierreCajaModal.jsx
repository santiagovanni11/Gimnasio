import { useState } from "react";
import { formatoMoneda } from "../../utils/pagos";
import {
  calcularCierreCaja,
  calcularCierreRango,
} from "../../utils/caja";
import { exportarCierrePdf } from "../../utils/cajaPdf";
import { hoyISO, rangoSemanaActual } from "../../utils/fechas";
import { obtenerRol } from "../../services/almacenSesion";
import CierreCajaRangoCampos from "./CierreCajaRangoCampos";

/**
 * Modal de cierre de caja: totales por forma de pago para
 * un día o para un rango (semana/mes), con exportación a PDF.
 */
export default function CierreCajaModal({ pagos = [], onClose }) {
  const [modo, setModo] = useState("dia");
  const [fecha, setFecha] = useState(hoyISO());
  const [rango, setRango] = useState(rangoSemanaActual);

  const cierre =
    modo === "dia"
      ? calcularCierreCaja(pagos, fecha)
      : calcularCierreRango(pagos, rango.desde, rango.hasta);

  const responsable = obtenerRol() || "-";
  const esDia = modo === "dia";

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">CIERRE DE CAJA</span>
            <h3>Resumen {esDia ? "diario" : "por período"}</h3>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-ticket-body">
          <div className="cierre-modos">
            <button
              type="button"
              className={esDia ? "primary-small-button" : "secondary-button"}
              onClick={() => setModo("dia")}
            >
              Por día
            </button>
            <button
              type="button"
              className={esDia ? "secondary-button" : "primary-small-button"}
              onClick={() => setModo("rango")}
            >
              Por rango
            </button>
          </div>

          {esDia ? (
            <div className="ticket-row">
              <span>Fecha</span>
              <input
                type="date"
                className="input-fecha"
                value={fecha}
                max={hoyISO()}
                onChange={(event) => setFecha(event.target.value)}
              />
            </div>
          ) : (
            <CierreCajaRangoCampos rango={rango} setRango={setRango} />
          )}

          <div className="ticket-row">
            <span>Responsable</span>
            <strong>{responsable}</strong>
          </div>

          {cierre.formas.length === 0 ? (
            <p className="empty-state">
              No hay cobros registrados{" "}
              {esDia ? "para esta fecha." : "en este período."}
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
            <span>{esDia ? "Total del día" : "Total del período"}</span>
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
