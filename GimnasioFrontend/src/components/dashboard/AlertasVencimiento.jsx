// AlertasVencimiento — Membresías que vencen en breve.
import { diasParaVencer } from "../../utils/vencimientosMembresia";

export default function AlertasVencimiento({ membresias = [], onCobrar, onVer }) {
  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Membresías por vencer</h3>
        <span className="panel-inicio-contador">{membresias.length}</span>
      </div>

      {membresias.length === 0 ? (
        <p className="panel-inicio-vacio">Sin vencimientos cercanos.</p>
      ) : (
        <ul className="alerta-lista">
          {membresias.slice(0, 5).map((m) => {
            const dias = diasParaVencer(m.fechaFin);
            return (
              <li key={m.id} className="alerta-item">
                <div>
                  <span className="alerta-nombre">
                    {m.socioNombre} {m.socioApellido}
                  </span>
                  <span className="alerta-sub">
                    {dias <= 0 ? "Vence hoy" : `Vence en ${dias} días`}
                  </span>
                </div>
                <button type="button" className="link-button" onClick={onCobrar}>
                  Cobrar
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="panel-inicio-pie" onClick={onVer}>
        Ver membresías
      </button>
    </div>
  );
}
