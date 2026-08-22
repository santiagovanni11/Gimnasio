import { formatoMoneda } from "../../utils/pagos";

/**
 * Alerta de socios con saldo pendiente.
 * Se muestra solo cuando existen morosos.
 */
export default function MorososAlert({ morosos = [] }) {
  if (!morosos.length) {
    return null;
  }

  return (
    <section className="content-card morosos-alert">
      <div className="section-header">
        <div>
          <h3>Socios con saldo pendiente</h3>
          <p>
            {morosos.length} membresía{morosos.length !== 1 ? "s" : ""} con
            cobro incompleto.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Plan</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Vence</th>
            </tr>
          </thead>

          <tbody>
            {morosos.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.socioNombre} {m.socioApellido}
                </td>
                <td>{m.planNombre}</td>
                <td>{formatoMoneda(m.pagado)}</td>
                <td>
                  <span className="status-warning">
                    {formatoMoneda(m.saldo)}
                  </span>
                </td>
                <td>
                  {m.fechaFin
                    ? new Date(m.fechaFin).toLocaleDateString("es-AR")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
