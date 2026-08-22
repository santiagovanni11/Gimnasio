// =========================================================
// FICHA DEL SOCIO — Modal con datos, membresía e historial
// El historial de pagos vive en HistorialPagosTabla.
// =========================================================

import {
  formatoMoneda,
  totalAprobadoPorMembresia,
} from "../../utils/pagos";
import { getMembresiaVisual } from "../../utils/socios";
import { getPlanBadgeClase } from "../../utils/planes";
import HistorialPagosTabla from "./HistorialPagosTabla";

function FichaSocioModal({
  socio,
  membresias = [],
  membresiasRechazadasIds,
  pagos = [],
  onClose,
}) {
  if (!socio) return null;

  const visual = getMembresiaVisual(
    socio,
    membresias,
    membresiasRechazadasIds
  );

  const pagosDelSocio = pagos
    .filter((p) => Number(p.socioId) === Number(socio.id))
    .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));

  const membresiaValida = visual.membresia;
  const pagado = membresiaValida
    ? totalAprobadoPorMembresia(pagos).get(Number(membresiaValida.id)) || 0
    : 0;
  const saldo = membresiaValida
    ? Number(membresiaValida.precioAplicado || 0) - pagado
    : 0;

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <Encabezado socio={socio} onClose={onClose} />

        <div className="payment-ticket-body">
          <h4>Datos personales</h4>
          <Dato etiqueta="DNI" valor={socio.dni} />
          <Dato etiqueta="Teléfono" valor={socio.telefono} />
          <Dato etiqueta="Email" valor={socio.email} />
          <Dato etiqueta="Dirección" valor={socio.direccion} />
          <Dato
            etiqueta="Fecha de nacimiento"
            valor={fecha(socio.fechaNacimiento)}
          />
          <Dato etiqueta="Alta" valor={fecha(socio.fechaAlta)} />

          <h4>Membresía</h4>
          <div className="ticket-row">
            <span>Estado</span>
            <strong>
              <span className={visual.clase}>{visual.texto}</span>
            </strong>
          </div>

          {membresiaValida && (
            <>
              <div className="ticket-row">
                <span>Plan</span>
                <strong>
                  <span
                    className={getPlanBadgeClase(
                      membresiaValida.planNombre
                    )}
                  >
                    {membresiaValida.planNombre}
                  </span>
                </strong>
              </div>

              <Dato etiqueta="Vence" valor={fecha(visual.fechaFin)} />

              <div className="ticket-row">
                <span>Pagado / Total</span>
                <strong>
                  {formatoMoneda(pagado)} /{" "}
                  {formatoMoneda(membresiaValida.precioAplicado)}
                </strong>
              </div>

              <Saldo saldo={saldo} />
            </>
          )}

          <h4>Pagos ({pagosDelSocio.length})</h4>

          <HistorialPagosTabla pagos={pagosDelSocio} />
        </div>

        <div className="payment-modal-actions">
          <button
            type="button"
            className="primary-small-button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "";

function Dato({ etiqueta, valor }) {
  return (
    <div className="ticket-row">
      <span>{etiqueta}</span>
      <strong>{valor || "-"}</strong>
    </div>
  );
}

function Saldo({ saldo }) {
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

function Encabezado({ socio, onClose }) {
  return (
    <div className="payment-ticket-header">
      <div>
        <span className="eyebrow">FICHA DEL SOCIO</span>
        <h3>
          {socio.nombre} {socio.apellido}
        </h3>
      </div>

      <button type="button" className="close-button" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default FichaSocioModal;
