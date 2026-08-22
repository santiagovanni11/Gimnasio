import { descargarTicketPdf } from "../../utils/ticket";

export default function PagoModal({ modalPago, ticketPago, onClose }) {
  if (!modalPago && !ticketPago) {
    return null;
  }

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className={
          ticketPago
            ? "payment-modal payment-modal-ticket"
            : "payment-modal payment-modal-alert"
        }
        onClick={(event) => event.stopPropagation()}
      >
        {ticketPago ? (
          <>
            <div className="payment-ticket-header">
              <div>
                <span className="eyebrow">COMPROBANTE</span>
                <h3>Ticket de pago</h3>
              </div>
              <button type="button" className="close-button" onClick={onClose}>
                ×
              </button>
            </div>

            <div className="payment-ticket-body">
              <div className="ticket-row">
                <span>Cliente</span>
                <strong>
                  {ticketPago.clienteNombre}
                </strong>
              </div>
              <div className="ticket-row">
                <span>DNI</span>
                <strong>{ticketPago.clienteDni || "-"}</strong>
              </div>
              <div className="ticket-row">
                <span>Teléfono</span>
                <strong>{ticketPago.clienteTelefono || "-"}</strong>
              </div>
              <div className="ticket-row">
                <span>Email</span>
                <strong>{ticketPago.clienteEmail || "-"}</strong>
              </div>
              <div className="ticket-row">
                <span>Plan</span>
                <strong>{ticketPago.planNombre}</strong>
              </div>
              <div className="ticket-row">
                <span>Fecha</span>
                <strong>{ticketPago.fecha}</strong>
              </div>
              <div className="ticket-row total-row">
                <span>Total</span>
                <strong>{ticketPago.monto}</strong>
              </div>
            </div>

            <div className="payment-modal-actions">
              <button type="button" className="secondary-button" onClick={onClose}>
                Cerrar
              </button>
              <button
                type="button"
                className="primary-small-button"
                onClick={() => descargarTicketPdf(ticketPago)}
              >
                Descargar PDF
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="payment-alert-header">
              <div className="payment-alert-icon">!</div>
              <div>
                <span className="eyebrow">PAGO RECHAZADO</span>
                <h3>{modalPago?.title || "Algo salió mal"}</h3>
              </div>
            </div>

            <p className="payment-alert-message">
              {modalPago?.message || "Pago rechazado"}
            </p>

            <div className="payment-modal-actions">
              <button type="button" className="primary-small-button" onClick={onClose}>
                Aceptar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
