// =========================================================
// PIEZAS DE UI DEL FORMULARIO DE PAGO
// Encabezado, campo envolvente y barra de acciones.
// =========================================================

function PagoEncabezado({ enEdicion, pagoEditando }) {
  return (
    <div className="form-card-header payment-checkout-header">
      <div>
        <h3>
          {enEdicion
            ? `Editando pago #${pagoEditando.id}`
            : "Registrar pago"}
        </h3>

        <p>
          {enEdicion
            ? "Modificá los datos del pago y guardá los cambios."
            : "Asociá el cobro a la membresía correspondiente."}
        </p>
      </div>

      <div className="checkout-secure-badge">
        {enEdicion ? "Editando" : "Cobro seguro"}
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function AccionesPago({ enEdicion, guardando, onCancelar }) {
  return (
    <div className="form-actions payment-full-width">
      <button type="button" className="secondary-button" onClick={onCancelar}>
        {enEdicion ? "Cancelar edición" : "Cancelar pago"}
      </button>

      <button
        type="submit"
        className="primary-small-button"
        disabled={guardando}
      >
        {guardando
          ? enEdicion
            ? "Guardando..."
            : "Registrando..."
          : enEdicion
          ? "Guardar cambios"
          : "Guardar pago"}
      </button>
    </div>
  );
}

export { PagoEncabezado, Campo, AccionesPago };
