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
import PagosFiltros from "./PagosFiltros";
import IngresosBanner from "./IngresosBanner";
import PagosModales from "./PagosModales";
import EstadosLista from "../common/EstadosLista";
import { useFiltrosPagos } from "../../hooks/useFiltrosPagos";
import { useResumenPagos } from "../../hooks/useResumenPagos";
import { exportarPagosCsv, exportarPagosPdf } from "../../utils/pagosExportar";

function PagosSection(props) {
  const {
    pagos, membresias, membresiasRechazadasIds,
    formPago, setFormPago,
    registrarPago, guardandoPago, errorPagos,
    busquedaPago, setBusquedaPago, pagosFiltrados,
    eliminarPago, cargandoPagos,
    modalPago, setModalPago, ticketPago, setTicketPago,
    cambiarEstadoPago, pagoEditando,
    guardarPagoEditado, cancelarEdicionPago, cancelarRegistroPago,
  } = props;

  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [cierreAbierto, setCierreAbierto] = useState(false);

  const filtros = useFiltrosPagos({ pagosFiltrados, membresias });

  const { saldoPorPago, morosos } = useResumenPagos({
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

      <MorososAlert morosos={morosos} />

      <ResumenCaja pagos={pagos} />

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
        filtroPlan={filtros.filtroPlan} setFiltroPlan={filtros.setFiltroPlan}
        filtroFormaPago={filtros.filtroFormaPago}
        setFiltroFormaPago={filtros.setFiltroFormaPago}
        fechaDesde={filtros.fechaDesde} setFechaDesde={filtros.setFechaDesde}
        fechaHasta={filtros.fechaHasta} setFechaHasta={filtros.setFechaHasta}
        limpiarFiltros={filtros.limpiarFiltros}
        abrirCierreCaja={() => setCierreAbierto(true)}
        exportarCSV={() =>
          exportarPagosCsv(filtros.pagosConFiltros, membresias)
        }
        exportarPDF={() =>
          exportarPagosPdf(filtros.pagosConFiltros, filtros)
        }
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
