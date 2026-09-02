// =========================================================
// PAGOS DE LA MEMBRESÍA (lista del modal de detalle)
// =========================================================

import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
} from "../../utils/pagos";
import { fechaHoraTexto } from "../../utils/fechas";

const claseEstado = (estado) => {
  if (Number(estado) === 2) return "status-active";
  if (Number(estado) === 1) return "status-warning";
  return "status-inactive";
};

/**
 * Mini tabla con los pagos registrados sobre la membresía.
 * Se asume la lista ya filtrada y ordenada.
 */
export default function PagosDeMembresia({ pagos = [] }) {
  return (
    <div className="modal-tabla-scroll">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Forma</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id}>
              <td>{fechaHoraTexto(pago.fechaPago)}</td>
              <td>{formaPagoTexto(pago.formaPago)}</td>
              <td>{formatoMoneda(pago.monto)}</td>
              <td>
                <span className={claseEstado(pago.estado)}>
                  {estadoPagoTexto(pago.estado)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
