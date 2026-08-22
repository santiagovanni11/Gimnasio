// =========================================================
// MODALES DE PAGOS — Comprobante, alerta, cierre y detalle
// =========================================================

import PagoModal from "./PagoModal";
import CierreCajaModal from "./CierreCajaModal";
import DetallePagoModal from "./DetallePagoModal";

function PagosModales({
  modalPago,
  ticketPago,
  onClose,
  cierreAbierto,
  onCerrarCierre,
  pagos,
  pagoDetalle,
  setPagoDetalle,
  membresias,
  saldoPorPago,
}) {
  return (
    <>
      <PagoModal
        modalPago={modalPago}
        ticketPago={ticketPago}
        onClose={onClose}
      />

      {cierreAbierto && (
        <CierreCajaModal pagos={pagos} onClose={onCerrarCierre} />
      )}

      <DetallePagoModal
        pago={pagoDetalle}
        membresias={membresias}
        saldoInfo={
          pagoDetalle
            ? saldoPorPago.get(Number(pagoDetalle.id))
            : null
        }
        onClose={() => setPagoDetalle(null)}
      />
    </>
  );
}

export default PagosModales;
