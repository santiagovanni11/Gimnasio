// =========================================================
// PRÓXIMOS VENCIMIENTOS — Membresías activas que vencen pronto
// Complementa RecuperacionPanel, que cubre las ya vencidas.
// Reusa enVentanaDeVencimiento (solo activas) y diasParaVencer.
// =========================================================

import {
  enVentanaDeVencimiento,
  diasParaVencer,
} from "../../utils/vencimientosMembresia";
import { fechaTexto } from "../../utils/fechas";

const DIAS_VENTANA = 7;

export default function ProximosVencimientos({ membresias = [], onRenovar }) {
  const proximas = membresias
    .filter((m) => enVentanaDeVencimiento(m, DIAS_VENTANA))
    .sort((a, b) => new Date(a.fechaFin) - new Date(b.fechaFin));

  if (!proximas.length) return null;

  return (
    <section className="content-card morosos-alert">
      <div className="section-header">
        <div>
          <h3>Próximos vencimientos</h3>
          <p>
            {proximas.length} membresía
            {proximas.length === 1 ? "" : "s"} vence
            {proximas.length === 1 ? "" : "n"} en menos de {DIAS_VENTANA} días.
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
              <th>Faltan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {proximas.map((m) => {
              const dias = diasParaVencer(m.fechaFin);
              return (
                <tr key={m.id}>
                  <td>{m.socioNombre} {m.socioApellido}</td>
                  <td>{m.planNombre}</td>
                  <td>{fechaTexto(m.fechaFin) || "-"}</td>
                  <td>
                    <span className="status-warning">
                      {dias === 1 ? "1 día" : `${dias} días`}
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
