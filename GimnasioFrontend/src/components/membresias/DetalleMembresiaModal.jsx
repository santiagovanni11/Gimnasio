// =========================================================
// MODAL DE DETALLE DE MEMBRESÍA
// Período, saldo, pagos asociados e historia del socio
// (antigüedad y aporte total) en una sola vista.
// =========================================================

import {
  formatoMoneda,
  esAprobado,
} from "../../utils/pagos";
import { estadoMembresiaTexto } from "../../utils/membresias";
import { fechaTexto } from "../../utils/fechas";
import { totalAprobadoDelPeriodoPorMembresia } from "../../utils/pagosPeriodo";
import {
  pagosDeMembresia,
  resumenSocio,
} from "../../utils/detalleMembresia";
import { etiquetaEstadoOperativo } from "../../utils/membresiasMetadata";
import { exportarMembresiaPdf } from "../../utils/exportar/membresiasExportarPdf";
import PagosDeMembresia from "./PagosDeMembresia";
import HistorialMembresias from "./HistorialMembresias";

function Fila({ etiqueta, children }) {
  return (
    <div className="ticket-row">
      <span>{etiqueta}</span>
      <strong>{children}</strong>
    </div>
  );
}

export default function DetalleMembresiaModal({
  membresia,
  membresias = [],
  pagos = [],
  onClose,
}) {
  if (!membresia) return null;

  const pagosAsociados = pagosDeMembresia(pagos, membresia.id);
  const historial = resumenSocio(membresias, pagos, membresia.socioId);

  const pagadoPeriodo =
    totalAprobadoDelPeriodoPorMembresia(
      pagos,
      membresias
    ).get(Number(membresia.id)) || 0;

  const saldo =
    Number(membresia.precioAplicado || 0) - pagadoPeriodo;
  const aprobados = pagosAsociados.filter(esAprobado);

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">DETALLE DE MEMBRESÍA</span>
            <h3>
              {membresia.socioNombre} {membresia.socioApellido}
            </h3>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-ticket-body">
          <Fila etiqueta="Plan">{membresia.planNombre}</Fila>

          <Fila etiqueta="Precio aplicado">
            {formatoMoneda(membresia.precioAplicado)}
          </Fila>

          <Fila etiqueta="Período">
            {fechaTexto(membresia.fechaInicio) || "-"} al{" "}
            {fechaTexto(membresia.fechaFin) || "-"}
          </Fila>

          <Fila etiqueta="Estado">
            <span className={claseEstado(membresia.estado)}>
              {estadoMembresiaTexto(membresia.estado)}
            </span>
            <span className="chip-auto" style={{ marginLeft: "8px" }}>
              {etiquetaEstadoOperativo(membresia)}
            </span>
          </Fila>

          <Fila etiqueta="Cobrado del período">
            {formatoMoneda(pagadoPeriodo)}{" "}
            {saldo > 0 && (
              <span className="status-warning">
                Debe {formatoMoneda(saldo)}
              </span>
            )}
            {saldo <= 0 && (
              <span className="status-active">Sin deuda</span>
            )}
          </Fila>

          <h4 style={{ margin: "14px 0 8px" }}>Historial del socio</h4>

          <Fila etiqueta="Socio desde">
            {fechaTexto(historial.desde) || "-"}
          </Fila>

          <Fila etiqueta="Membresías registradas">
            {historial.registradas}
          </Fila>

          <Fila etiqueta="Aporte histórico">
            {formatoMoneda(historial.totalHistorico)} ·{" "}
            {aprobados.length} cobro{aprobados.length === 1 ? "" : "s"}
          </Fila>

          <HistorialMembresias membresiaId={membresia.id} />

          <h4 style={{ margin: "14px 0 8px" }}>
            Pagos de esta membresía ({pagosAsociados.length})
          </h4>

          {pagosAsociados.length ? (
            <PagosDeMembresia pagos={pagosAsociados} />
          ) : (
            <p className="dialogo-mensaje">
              Sin pagos registrados para esta membresía.
            </p>
          )}
        </div>

        <div className="payment-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => exportarMembresiaPdf(membresia, pagosAsociados, historial)}
          >
            Descargar PDF
          </button>
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

function claseEstado(estado) {
  const valor = Number(estado);

  if (valor === 2) return "status-active";
  if (valor === 1) return "status-warning";
  if (valor === 3) return "status-expired";

  return "status-inactive";
}
