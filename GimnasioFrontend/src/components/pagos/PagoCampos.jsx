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

const formatearMonto = (valor) =>
  `$${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(Number(valor || 0))}`;

/** Campos principales del checkout: membresía, monto, forma,
 *  fecha y referencia. */
function CamposPrincipales({
  disponibles,
  formPago,
  cambiarMembresia,
  cambiarFormaPago,
  actualizarCampo,
}) {
  return (
    <>
      <Campo label="Membresía">
        <select
          value={formPago.membresiaId}
          onChange={(e) => cambiarMembresia(e.target.value)}
        >
          <option value="">Seleccionar membresía</option>

          {disponibles.map((m) => (
            <option key={m.id} value={m.id}>
              {m.socioNombre} {m.socioApellido} - {m.planNombre}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="Monto">
        <input
          type="text"
          className="payment-monto-input"
          value={formatearMonto(formPago.monto)}
          placeholder="$60.000"
          readOnly
        />
      </Campo>

      <Campo label="Forma de pago">
        <select
          value={formPago.formaPago}
          onChange={(e) => cambiarFormaPago(e.target.value)}
        >
          <option value="1">Efectivo</option>
          <option value="2">Transferencia</option>
          <option value="3">Mercado Pago</option>
          <option value="4">Tarjeta débito</option>
          <option value="5">Tarjeta crédito</option>
        </select>
      </Campo>

      <Campo label="Fecha">
        <input
          type="date"
          value={formPago.fechaPago}
          onChange={(e) =>
            actualizarCampo("fechaPago", e.target.value)
          }
        />
      </Campo>

      <Campo label="Referencia">
        <input
          type="text"
          value={formPago.referencia}
          onChange={(e) =>
            actualizarCampo("referencia", e.target.value)
          }
          placeholder="Ej: OP-1024"
        />
      </Campo>
    </>
  );
}

export {
  PagoEncabezado,
  Campo,
  AccionesPago,
  CamposPrincipales,
};
