// =========================================================
// PAGOS — Sección principal
// Compone morosos, resumen, checkout, filtros y resultados.
// Filtros en useFiltrosPagos; saldos en utils/saldosPagos;
// modales en PagosModales.
// =========================================================

import { useState } from "react";
import ResumenCaja from "./ResumenCaja";
import PagoForm from "./PagoForm";
import TablaPagos from "./TablaPagos";
import MorososAlert from "./MorososAlert";
import VencimientosProximosAlert from "./VencimientosProximosAlert";
import PagosFiltros from "./PagosFiltros";
import IngresosBanner from "./IngresosBanner";
import PagosModales from "./PagosModales";
import EstadosLista from "../common/EstadosLista";
import PagosResumenPanel from "./PagosResumenPanel";
import PagoAuditoriaPanel from "./PagoAuditoriaPanel";
import PagosRechazadosPanel from "./PagosRechazadosPanel";
import { useFiltrosPagos } from "../../hooks/useFiltrosPagos";
import { useResumenPagos } from "../../hooks/useResumenPagos";
import { exportarPagosCsv, exportarPagosPdf } from "../../utils/pagosExportar";
import { ESTADO_PAGO } from "../../utils/pagos";

function PagosSection(props) {
  const {
    planes, pagos, membresias, membresiasRechazadasIds,
    formPago, setFormPago,
    registrarPago, guardandoPago, errorPagos,
    busquedaPago, setBusquedaPago, pagosFiltrados,
    eliminarPago, cargandoPagos,
    modalPago, setModalPago, ticketPago, setTicketPago,
    cambiarEstadoPago, pagoEditando,
    guardarPagoEditado, cancelarEdicionPago, cancelarRegistroPago,
    editarPago, cancelarMembresia,
  } = props;

  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [cierreAbierto, setCierreAbierto] = useState(false);

  const filtros = useFiltrosPagos({ pagosFiltrados, membresias });

  const { saldoPorPago, morosos, porVencer } = useResumenPagos({
    pagos,
    membresias,
  });

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Pagos</h2>
          <p>Control de caja, ingresos y cobros de membresías.</p>
        </div>
      </div>

      <VencimientosProximosAlert vencimientos={porVencer} />

      <MorososAlert
        morosos={morosos}
        onCancelarPendientes={cancelarMembresia}
      />

      <ResumenCaja pagos={pagos} />
      <PagosResumenPanel pagos={pagos} />
      <PagoAuditoriaPanel pagos={pagos} />
      <PagosRechazadosPanel
        pagos={pagos}
        onReintentar={(pago) => cambiarEstadoPago(pago, ESTADO_PAGO.PENDIENTE)}
        onCancelarRevision={(pago) => cambiarEstadoPago(pago, ESTADO_PAGO.RECHAZADO)}
        onDelete={eliminarPago}
      />

      <PagoForm
        membresias={membresias}
        membresiasPendientes={morosos}
        membresiasRechazadasIds={membresiasRechazadasIds}
        formPago={formPago}
        setFormPago={setFormPago}
        registrarPago={registrarPago}
        guardandoPago={guardandoPago}
        errorPagos={errorPagos}
        pagoEditando={pagoEditando}
        guardarPagoEditado={guardarPagoEditado}
        cancelarEdicionPago={cancelarEdicionPago}
        cancelarRegistroPago={cancelarRegistroPago}
      />

      <PagosFiltros
        busquedaPago={busquedaPago} setBusquedaPago={setBusquedaPago}
        planes={planes}
        filtroPlan={filtros.filtroPlan} setFiltroPlan={filtros.setFiltroPlan}
        filtroFormaPago={filtros.filtroFormaPago} setFiltroFormaPago={filtros.setFiltroFormaPago}
        filtroEstado={filtros.filtroEstado} setFiltroEstado={filtros.setFiltroEstado}
        ordenPagos={filtros.ordenPagos} setOrdenPagos={filtros.setOrdenPagos}
        fechaDesde={filtros.fechaDesde} setFechaDesde={filtros.setFechaDesde}
        fechaHasta={filtros.fechaHasta} setFechaHasta={filtros.setFechaHasta}
        limpiarFiltros={filtros.limpiarFiltros}
        abrirCierreCaja={() => setCierreAbierto(true)}
        exportarCSV={() => exportarPagosCsv(filtros.pagosConFiltros, membresias)}
        exportarPDF={() => exportarPagosPdf(filtros.pagosConFiltros, filtros)}
        hayResultados={filtros.pagosConFiltros.length > 0}
      />

      <EstadosLista
        cargando={cargandoPagos}
        error={errorPagos}
        total={pagos.length}
        filtrados={filtros.pagosConFiltros.length}
        mensajeCargando="Cargando pagos..."
        mensajeVacio="Todavía no hay pagos registrados."
        mensajeSinResultado="No se encontraron pagos para los filtros seleccionados."
      />

      {!cargandoPagos && !errorPagos && filtros.pagosConFiltros.length > 0 && (
        <>
          <IngresosBanner pagos={filtros.pagosConFiltros} />

          <TablaPagos
            pagos={filtros.pagosConFiltros}
            membresias={membresias}
            saldoPorPago={saldoPorPago}
            onDelete={eliminarPago}
            onViewDetail={setPagoDetalle}
            onCambiarEstado={cambiarEstadoPago}
            onEditar={(pago) => {
              editarPago(pago);
              document.getElementById("checkout-pago")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </>
      )}

      <PagosModales
        modalPago={modalPago}
        ticketPago={ticketPago}
        onClose={() => {
          setModalPago(null);
          setTicketPago(null);
        }}
        cierreAbierto={cierreAbierto}
        onCerrarCierre={() => setCierreAbierto(false)}
        pagos={pagos}
        pagoDetalle={pagoDetalle}
        setPagoDetalle={setPagoDetalle}
        membresias={membresias}
        saldoPorPago={saldoPorPago}
      />
    </section>
  );
}

export default PagosSection;
