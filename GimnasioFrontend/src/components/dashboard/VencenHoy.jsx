// VencenHoy — Membresías que vencen exactamente hoy.
import { nombreDeMembresia } from "../../utils/resumenInicioWidgets";

export default function VencenHoy({ membresias = [], onCobrar }) {
  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Vencen hoy</h3>
        <span className="panel-inicio-contador">{membresias.length}</span>
      </div>

      {membresias.length === 0 ? (
        <p className="panel-inicio-vacio">Ninguna membresía vence hoy.</p>
      ) : (
        <ul className="alerta-lista">
          {membresias.slice(0, 6).map((m) => (
            <li key={m.id} className="alerta-item">
              <span className="alerta-nombre">{nombreDeMembresia(m)}</span>
              <button
                type="button"
                className="link-button"
                onClick={onCobrar}
              >
                Cobrar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="panel-inicio-pie" onClick={onCobrar}>
        Ir a Pagos
      </button>
    </div>
  );
}
