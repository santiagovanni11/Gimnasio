// =========================================================
// DATOS DE TARJETA — Sección condicional del checkout
// Valida el número en vivo (Luhn) para avisar antes del submit.
// =========================================================

import {
  validarLuhn,
  prefijoCorrespondeConMarca,
} from "../../utils/tarjeta";
import { TARJETA_VALIDACION_STRICTA } from "../../utils/pagosCheckout";

function PagoFormTarjeta({ formPago, actualizarCampo }) {
  const formatearNumero = (valor) => {
    const digitos = (valor || "").replace(/\D/g, "").slice(0, 16);
    return digitos.replace(/(.{4})/g, "$1 ").trim();
  };

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

  const digitosNumero = String(formPago.numeroTarjeta || "").replace(
    /\D/g,
    ""
  );

  // Aviso en vivo cuando ya tiene la longitud esperada
  const esAmex =
    String(formPago.marcaTarjeta || "").toLowerCase() === "amex";
  const longitudEsperada = esAmex ? 15 : 16;
  const mostrarAvisoNumero =
    TARJETA_VALIDACION_STRICTA &&
    digitosNumero.length === longitudEsperada;
  const numeroValido = validarLuhn(digitosNumero);
  const prefijoOk = prefijoCorrespondeConMarca(
    digitosNumero,
    formPago.marcaTarjeta
  );

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

      <div className="input-group">
        <label>Número de tarjeta</label>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          className="payment-card-number-input"
          value={formatearNumero(formPago.numeroTarjeta || "")}
          onChange={(e) =>
            actualizarCampo(
              "numeroTarjeta",
              formatearNumero(e.target.value)
            )
          }
          placeholder="4111 1111 1111 1111"
        />

        {TARJETA_VALIDACION_STRICTA && digitosNumero.length > 0 && !prefijoOk && (
          <small
            className="error-message"
            style={{ display: "block", marginTop: "4px" }}
          >
            ✗ El prefijo no corresponde con{" "}
            {formPago.marcaTarjeta || "la marca"} (Visa arranca con 4,
            Mastercard con 51-55/22-27, Amex con 34 o 37)
          </small>
        )}

        {mostrarAvisoNumero && (
          <small
            className={
              numeroValido ? "success-message" : "error-message"
            }
            style={{ marginTop: "6px", display: "block" }}
          >
            {numeroValido
              ? "✓ Número válido"
              : "✗ El número no es válido — revisalo dígito por dígito"}
          </small>
        )}
      </div>

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
