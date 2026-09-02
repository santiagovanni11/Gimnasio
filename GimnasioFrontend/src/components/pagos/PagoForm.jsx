// =========================================================
// FORMULARIO DE PAGO — Checkout de cobros
// Orquesta el formulario; los campos principales viven en
// PagoCampos (CamposPrincipales) y la tarjeta en
// PagoFormTarjeta.
// =========================================================

import PagoFormTarjeta from "./PagoFormTarjeta";
import {
  PagoEncabezado,
  AccionesPago,
  CamposPrincipales,
} from "./PagoCampos";
import { persistirMetodoPagoSiCorresponde } from "../../utils/pagosCheckout/persistirMetodoPago";

function PagoForm(props) {
  const {
    membresias, membresiasPendientes, membresiasRechazadasIds,
    formPago, setFormPago,
    registrarPago, guardandoPago, errorPagos,
    pagoEditando, guardarPagoEditado,
    cancelarEdicionPago, cancelarRegistroPago,
  } = props;

  /**
   * Cobro nuevo: solo membresías con saldo pendiente.
   * En edición: todas las válidas (para conservar la elegida).
   */
  const baseLista = pagoEditando ? membresias : membresiasPendientes ?? [];

  const disponibles = baseLista.filter(
    (m) => !membresiasRechazadasIds?.has(Number(m.id))
  );

  const enEdicion = Boolean(pagoEditando);
  const requiereTarjeta = ["4", "5"].includes(
    String(formPago.formaPago)
  );

  const actualizarCampo = (campo, valor) =>
    setFormPago((prev) => ({ ...prev, [campo]: valor }));

  /** Al elegir membresía se precarga el monto a cobrar. */
  const cambiarMembresia = (valor) => {
    const membresia = disponibles.find(
      (m) => String(m.id) === String(valor)
    );

    const montoAuto = Number(
      membresia?.precioAplicado ?? membresia?.precio ?? 0
    );

    setFormPago((prev) => ({
      ...prev,
      membresiaId: valor,
      monto: valor ? String(montoAuto || 0) : "0",
      estado: ["1", "4", "5"].includes(String(prev.formaPago))
        ? "2"
        : prev.estado,
    }));
  };

  /** Cambiar la forma de pago reinicia el estado a Aprobado. */
  const cambiarFormaPago = (valor) =>
    setFormPago((prev) => ({
      ...prev,
      formaPago: valor,
      estado: "2",
    }));

  /**
   * Envía el formulario y, al cobrar con tarjeta nueva, guarda
   * el método de pago del socio para la renovación automática.
   */
  const manejarEnvio = async (event) => {
    if (enEdicion) {
      await guardarPagoEditado(event);
      return;
    }
    await registrarPago(event);
    await persistirMetodoPagoSiCorresponde(formPago, membresias);
  };

  return (
    <div id="checkout-pago" className="form-card payment-checkout-card">
      <PagoEncabezado enEdicion={enEdicion} pagoEditando={pagoEditando} />

      <form
        onSubmit={manejarEnvio}
        className="payment-form-grid"
      >
        <CamposPrincipales
          disponibles={disponibles}
          formPago={formPago}
          cambiarMembresia={cambiarMembresia}
          cambiarFormaPago={cambiarFormaPago}
          actualizarCampo={actualizarCampo}
        />

        {requiereTarjeta && (
          <PagoFormTarjeta
            formPago={formPago}
            actualizarCampo={actualizarCampo}
          />
        )}

        <div className="input-group payment-full-width">
          <label>Observaciones</label>
          <textarea
            rows="3"
            value={formPago.observaciones}
            onChange={(e) =>
              actualizarCampo("observaciones", e.target.value)
            }
            placeholder="Detalle del cobro, nota del cliente, etc."
          />
        </div>

        {errorPagos && (
          <div className="error-message payment-full-width">
            {errorPagos}
          </div>
        )}

        <AccionesPago
          enEdicion={enEdicion}
          guardando={guardandoPago}
          onCancelar={
            enEdicion ? cancelarEdicionPago : cancelarRegistroPago
          }
        />
      </form>
    </div>
  );
}

export default PagoForm;
