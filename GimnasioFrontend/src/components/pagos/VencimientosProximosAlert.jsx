// =========================================================
// ALERTA DE VENCIMIENTOS PRÓXIMOS
// Membresías activas que vencen hoy o mañana: permite cobrar
// la renovación antes de que el socio se atrase.
// =========================================================

import { fechaTexto } from "../../utils/fechas";
import { diasParaVencer } from "../../utils/vencimientosMembresia";

function ChipVencimiento({ dias }) {
  const esHoy = dias === 0;

  return (
    <span className={esHoy ? "status-blocked" : "status-warning"}>
      {esHoy ? "Vence hoy" : "Vence mañana"}
    </span>
  );
}

/**
 * Alerta de membresías por vencer en las próximas 24 horas.
 * Se muestra solo cuando hay coincidencias.
 */
export default function VencimientosProximosAlert({
  vencimientos = [],
}) {
  if (!vencimientos.length) {
    return null;
  }

  return (
    <section className="content-card morosos-alert">
      <div className="section-header">
        <div>
          <h3>Renovaciones inmediatas</h3>
          <p>
            {vencimientos.length} membre
            {vencimientos.length === 1 ? "sía" : "sías"}{" "}
            {vencimientos.length === 1 ? "vence" : "vencen"} hoy o
            mañana. Buen momento para contactar al socio.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Plan</th>
              <th>Vence</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {vencimientos.map((m) => {
              const dias = diasParaVencer(m.fechaFin);

              return (
                <tr key={m.id}>
                  <td>
                    {m.socioNombre} {m.socioApellido}
                  </td>
                  <td>{m.planNombre}</td>
                  <td>{fechaTexto(m.fechaFin) || "-"}</td>
                  <td>
                    <ChipVencimiento dias={dias} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
