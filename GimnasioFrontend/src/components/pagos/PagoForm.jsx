// =========================================================
// FORMULARIO DE PAGO — Checkout de cobros
// Piezas de UI en PagoCampos; tarjeta en PagoFormTarjeta.
// =========================================================

import PagoFormTarjeta from "./PagoFormTarjeta";
import { PagoEncabezado, Campo, AccionesPago } from "./PagoCampos";

const formatearMonto = (valor) =>
  `$${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(Number(valor || 0))}`;

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

  return (
    <div className="form-card payment-checkout-card">
      <PagoEncabezado enEdicion={enEdicion} pagoEditando={pagoEditando} />

      <form
        onSubmit={enEdicion ? guardarPagoEditado : registrarPago}
        className="payment-form-grid"
      >
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
            onChange={(e) =>
              setFormPago((prev) => ({
                ...prev,
                formaPago: e.target.value,
                estado: "2",
              }))
            }
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
