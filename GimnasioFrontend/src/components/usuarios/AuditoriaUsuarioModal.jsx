// =========================================================
// MODAL AUDITORÍA DE USUARIO
// Historial de movimientos de la cuenta: creación, cambios
// de rol/estado, resets y eliminaciones.
// =========================================================

import { fechaHoraTexto } from "../../utils/fechas";

function AuditoriaUsuarioModal({
  auditoria,
  onClose,
}) {
  const { usuario, registros, cargando } = auditoria;

  if (!usuario) return null;

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">AUDITORÍA</span>

            <h3>{usuario.email}</h3>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="payment-ticket-body">
          {cargando ? (
            <p className="info-message">Cargando historial...</p>
          ) : registros.length === 0 ? (
            <p className="empty-state">
              Esta cuenta todavía no tiene movimientos registrados.
            </p>
          ) : (
            registros.map((registro) => (
              <FilaAuditoria key={registro.id} registro={registro} />
            ))
          )}
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

function FilaAuditoria({ registro }) {
  return (
    <div
      className="payment-breakdown-card"
      style={{ marginBottom: "10px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <strong>{registro.accion}</strong>

        <small style={{ color: "#8b929c" }}>
          {fechaHoraTexto(registro.fechaUtc)}
        </small>
      </div>

      {(registro.detalle || registro.realizadoPorEmail) && (
        <small style={{ color: "#8b929c" }}>
          {registro.detalle}
          {registro.detalle && registro.realizadoPorEmail
            ? " · "
            : ""}
          {registro.realizadoPorEmail &&
            `Registró: ${registro.realizadoPorEmail}`}
        </small>
      )}
    </div>
  );
}

export default AuditoriaUsuarioModal;
