// =========================================================
// HISTORIAL DE PRECIOS — Auditoría por plan (modal)
// Muestra quién cambió qué, cuándo, y si rige o está pendiente.
// =========================================================

import { formatoMoneda } from "../../utils/pagos";
import { fechaHoraTexto } from "../../utils/fechas";

function HistorialPreciosModal({
  plan,
  filas = [],
  cargando,
  onClose,
}) {
  if (!plan) return null;

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal payment-modal-detail"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">AUDITORÍA</span>

            <h3>Precios · {plan.nombre}</h3>
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
          ) : filas.length === 0 ? (
            <p className="empty-state">
              Este plan todavía no tiene cambios registrados.
            </p>
          ) : (
            filas.map((fila) => (
              <FilaHistorial key={fila.id} fila={fila} />
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

function FilaHistorial({ fila }) {
  const pendiente = fila.estado === "Pendiente";

  return (
    <div className="payment-breakdown-card" style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <strong>
          {fechaHoraTexto(fila.fechaUtc)}
        </strong>

        <span className={pendiente ? "status-warning" : "status-active"}>
          {pendiente
            ? `Rige ${new Date(fila.vigenteDesde).toLocaleDateString("es-AR")}`
            : "Vigente aplicado"}
        </span>
      </div>

      <small style={{ color: "#8b929c" }}>
        Registró: {fila.usuario || "-"}
      </small>

      <div className="payment-breakdown-list" style={{ marginTop: "8px" }}>
        <Linea titulo="1 mes" valor={fila.precio1Mes} />
        <Linea titulo="3 meses" valor={fila.precio3Meses} />
        <Linea titulo="6 meses" valor={fila.precio6Meses} />
        <Linea titulo="12 meses" valor={fila.precio12Meses} />
      </div>
    </div>
  );
}

function Linea({ titulo, valor }) {
  return (
    <div className="ticket-row">
      <span>{titulo}</span>
      <strong>{formatoMoneda(valor)}</strong>
    </div>
  );
}

export default HistorialPreciosModal;
