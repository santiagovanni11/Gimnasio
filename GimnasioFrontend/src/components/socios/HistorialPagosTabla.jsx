// =========================================================
// HISTORIAL DE PAGOS — Tabla dentro de la ficha del socio
// =========================================================

import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
  soloAprobados,
} from "../../utils/pagos";
import { getPlanBadgeClase, getPlanNombre } from "../../utils/planes";

const formatoFecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

function FilaPago({ pago }) {
  const planNombre = getPlanNombre(pago);

  return (
    <tr>
      <td>{formatoFecha(pago.fechaPago)}</td>

      <td>
        <span className={getPlanBadgeClase(planNombre)}>
          {planNombre}
        </span>
      </td>

      <td>{formatoMoneda(pago.monto)}</td>
      <td>{formaPagoTexto(pago.formaPago)}</td>
      <td>{estadoPagoTexto(pago.estado)}</td>
    </tr>
  );
}

function HistorialPagosTabla({ pagos = [] }) {
  if (!pagos.length) {
    return <p className="empty-state">Sin pagos registrados.</p>;
  }

  const totalAprobado = soloAprobados(pagos).reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Membresía</th>
              <th>Monto</th>
              <th>Forma</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((pago) => (
              <FilaPago key={pago.id} pago={pago} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="ticket-row total-row">
        <span>Total aprobado</span>
        <strong>{formatoMoneda(totalAprobado)}</strong>
      </div>
    </>
  );
}

export default HistorialPagosTabla;
