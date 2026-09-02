// =========================================================
// PANEL DE RECUPERACIÓN DE MEMBRESÍAS
// Vencidas en los últimos 30 días con acceso directo a
// renovar: retención antes de que el socio se enfríe.
// =========================================================

import { fechaTexto } from "../../utils/fechas";
import { diasParaVencer } from "../../utils/vencimientosMembresia";
import { vencidasRecientes } from "../../utils/resumenMembresias";

const DIAS_VENTANA = 30;

/**
 * Alerta de recuperación. Se muestra solo cuando existen
 * membresías vencidas dentro de la ventana.
 */
export default function RecuperacionPanel({
  membresias = [],
  onRenovar,
}) {
  const candidatas = vencidasRecientes(membresias, DIAS_VENTANA);

  if (!candidatas.length) {
    return null;
  }

  return (
    <section className="content-card morosos-alert">
      <div className="section-header">
        <div>
          <h3>Recuperación de socios</h3>
          <p>
            {candidatas.length} membre
            {candidatas.length === 1 ? "sía" : "sías"} vencida
            {candidatas.length === 1 ? "" : "s"} en los últimos{" "}
            {DIAS_VENTANA} días. Un llamado ahora puede recuperarlas.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Plan</th>
              <th>Venció</th>
              <th>Antigüedad</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {candidatas.map((m) => {
              const haceDias = -diasParaVencer(m.fechaFin);

              return (
                <tr key={m.id}>
                  <td>
                    {m.socioNombre} {m.socioApellido}
                  </td>
                  <td>{m.planNombre}</td>
                  <td>{fechaTexto(m.fechaFin) || "-"}</td>
                  <td>
                    <span className="status-warning">
                      Hace {haceDias} día{haceDias === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="approve-button"
                      onClick={() => onRenovar?.(m)}
                      title="Renovar con el mismo socio y plan"
                    >
                      Renovar
                    </button>
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
