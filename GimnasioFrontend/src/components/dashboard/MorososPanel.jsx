// MorososPanel — Membresías con saldo adeudado en el Inicio.
import { nombreDeMembresia, formatoMoneda } from "../../utils/resumenInicioWidgets";

export default function MorososPanel({ morosos = [], onCobrar }) {
  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Morosos</h3>
        <span className="panel-inicio-contador">{morosos.length}</span>
      </div>

      {morosos.length === 0 ? (
        <p className="panel-inicio-vacio">Sin saldos pendientes.</p>
      ) : (
        <ul className="alerta-lista">
          {morosos.map((m) => (
            <li key={m.id} className="alerta-item">
              <div>
                <span className="alerta-nombre">{nombreDeMembresia(m)}</span>
                <span className="alerta-sub">{formatoMoneda(m.saldo)}</span>
              </div>
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
