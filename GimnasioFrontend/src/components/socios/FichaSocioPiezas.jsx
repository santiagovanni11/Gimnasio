// =========================================================
// PIEZAS DE UI DE LA FICHA DEL SOCIO
// Encabezado, fila de dato y saldo pendiente.
// =========================================================

import { formatoMoneda } from "../../utils/pagos";
import { getPlanBadgeClase } from "../../utils/planes";
import { fechaTexto as fecha } from "../../utils/fechas";
import Avatar from "../common/Avatar";

/** Resumen de la membresía vigente del socio (si tiene). */
export function ResumenMembresia({ visual, pagado }) {
  const membresia = visual?.membresia;

  if (!membresia) return null;

  const saldo = Number(membresia.precioAplicado || 0) - pagado;

  return (
    <>
      <div className="ticket-row">
        <span>Plan</span>
        <strong>
          <span className={getPlanBadgeClase(membresia.planNombre)}>
            {membresia.planNombre}
          </span>
        </strong>
      </div>

      <Dato etiqueta="Vence" valor={fecha(visual.fechaFin)} />

      <div className="ticket-row">
        <span>Pagado / Total</span>
        <strong>
          {formatoMoneda(pagado)} /{" "}
          {formatoMoneda(membresia.precioAplicado)}
        </strong>
      </div>

      <Saldo saldo={saldo} />
    </>
  );
}

export function Dato({ etiqueta, valor }) {
  return (
    <div className="ticket-row">
      <span>{etiqueta}</span>
      <strong>{valor || "-"}</strong>
    </div>
  );
}

export function Saldo({ saldo }) {
  return (
    <div className="ticket-row">
      <span>Saldo pendiente</span>
      <strong>
        {saldo > 0 ? (
          <span className="status-warning">{formatoMoneda(saldo)}</span>
        ) : (
          <span className="status-active">Sin deuda</span>
        )}
      </strong>
    </div>
  );
}

export function Encabezado({ socio, onClose }) {
  return (
    <div className="payment-ticket-header ficha-header">
      <div className="ficha-header-info">
        <span className="eyebrow">FICHA DEL SOCIO</span>
        <h3>
          {socio.nombre} {socio.apellido}
        </h3>
        <span className="ficha-header-dni">DNI {socio.dni || "-"}</span>
      </div>

      <div className="ficha-avatar">
        <Avatar
          nombre={socio.nombre}
          apellido={socio.apellido}
          email={socio.email}
          fotoUrl={socio.fotoUrl}
          size={72}
        />
      </div>

      <button type="button" className="close-button" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
