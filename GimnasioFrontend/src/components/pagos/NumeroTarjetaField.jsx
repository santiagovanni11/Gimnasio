// =========================================================
// CAMPO NÚMERO DE TARJETA
// Input con formato y avisos en vivo de validación estricta
// (prefijo BIN + Luhn) cuando está activada.
// =========================================================

import {
  validarLuhn,
  prefijoCorrespondeConMarca,
} from "../../utils/tarjeta";
import { TARJETA_VALIDACION_STRICTA } from "../../utils/pagosCheckout";

const formatearNumero = (valor) => {
  const digitos = (valor || "").replace(/\D/g, "").slice(0, 16);
  return digitos.replace(/(.{4})/g, "$1 ").trim();
};

function NumeroTarjetaField({ formPago, actualizarCampo }) {
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
  );
}

export default NumeroTarjetaField;
