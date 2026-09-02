// =========================================================
// DATOS DE TARJETA — Sección condicional del checkout
// Campos de titular, número, marca, vencimiento y CVV. La
// validación en vivo del número vive en NumeroTarjetaField.
// =========================================================

import NumeroTarjetaField from "./NumeroTarjetaField";

function PagoFormTarjeta({ formPago, actualizarCampo }) {
  /** Acepta MM/AA y MM/AAAA (evita que "02/2027" quede "02/20"). */
  const cambiarVencimiento = (valor) => {
    const digitos = valor.replace(/\D/g, "").slice(0, 6);

    let formato = digitos;

    if (digitos.length >= 5) {
      formato = `${digitos.slice(0, 2)}/${digitos.slice(2, 6)}`;
    } else if (digitos.length > 2) {
      formato = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    }

    actualizarCampo("vencimientoTarjeta", formato);
  };

  return (
    <>
      <div className="input-group">
        <label>Titular de la tarjeta</label>

        <input
          type="text"
          value={formPago.titularTarjeta || ""}
          onChange={(e) =>
            actualizarCampo("titularTarjeta", e.target.value)
          }
          placeholder="Nombre completo"
          autoComplete="cc-name"
        />
      </div>

      <NumeroTarjetaField
        formPago={formPago}
        actualizarCampo={actualizarCampo}
      />

      <MarcaField
        formPago={formPago}
        actualizarCampo={actualizarCampo}
      />

      <div className="input-group">
        <label>Vencimiento</label>

        <input
          type="text"
          autoComplete="cc-exp"
          value={formPago.vencimientoTarjeta || ""}
          onChange={(e) => cambiarVencimiento(e.target.value)}
          placeholder="MM/AA o MM/AAAA"
          maxLength={7}
        />
      </div>

      <div className="input-group">
        <label>CVV</label>

        <input
          type="password"
          autoComplete="off"
          value={formPago.cvvTarjeta || ""}
          onChange={(e) =>
            actualizarCampo(
              "cvvTarjeta",
              e.target.value.replace(/\D/g, "").slice(0, 4)
            )
          }
          placeholder="***"
        />
      </div>
    </>
  );
}

function MarcaField({ formPago, actualizarCampo }) {
  const marcas = ["Visa", "Mastercard", "Amex"];

  return (
    <div className="input-group">
      <label>Marca</label>

      <select
        value={formPago.marcaTarjeta || "Visa"}
        onChange={(e) => actualizarCampo("marcaTarjeta", e.target.value)}
      >
        {marcas.map((marca) => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PagoFormTarjeta;
