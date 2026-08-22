// =========================================================
// ACCIONES DE FILA DE MEMBRESÍA
// Editar, Renovar (vencidas y activas por vencer),
// Suspender/Reactivar, Cancelar y Eliminar.
// =========================================================

import { ESTADO_MEMBRESIA } from "../../utils/membresias";
import { diasParaVencer } from "../../utils/vencimientosMembresia";

const DIAS_AVISO_RENOVACION = 5;

function AccionesMembresia({
  membresia,
  abrirEdicion,
  renovar,
  suspender,
  reactivar,
  cancelar,
  eliminar,
}) {
  const estado = Number(membresia.estado);

  const vencida = estado === ESTADO_MEMBRESIA.VENCIDA;

  // Renovación anticipada: solo cuando quedan pocos días.
  const porVencer =
    estado === ESTADO_MEMBRESIA.ACTIVA &&
    diasParaVencer(membresia.fechaFin) <= DIAS_AVISO_RENOVACION;

  const puedeRenovar = vencida || porVencer;

  return (
    <div className="table-actions">
      <button
        type="button"
        className="edit-button"
        onClick={() => abrirEdicion(membresia)}
      >
        Editar
      </button>

      {puedeRenovar && (
        <button
          type="button"
          className="approve-button"
          onClick={() => renovar(membresia)}
          title="Renovar con el mismo socio y plan"
        >
          Renovar
        </button>
      )}

      {(estado === ESTADO_MEMBRESIA.ACTIVA ||
        estado === ESTADO_MEMBRESIA.PENDIENTE) && (
        <button
          type="button"
          className="secondary-button"
          onClick={() => suspender(membresia)}
          title="Pausa la membresía sin cancelarla"
        >
          Suspender
        </button>
      )}

      {estado === ESTADO_MEMBRESIA.SUSPENDIDA && (
        <button
          type="button"
          className="approve-button"
          onClick={() => reactivar(membresia)}
          title="Recalcula el estado según fechas"
        >
          Reactivar
        </button>
      )}

      {estado !== ESTADO_MEMBRESIA.CANCELADA && (
        <button
          type="button"
          className="delete-button"
          onClick={() => cancelar(membresia)}
          title="Cancelar membresía conservando historial"
        >
          Cancelar
        </button>
      )}

      <button
        type="button"
        className="delete-button"
        onClick={() => eliminar(membresia)}
        title="Eliminación definitiva (solo Administrador)"
      >
        Eliminar
      </button>
    </div>
  );
}

export default AccionesMembresia;
