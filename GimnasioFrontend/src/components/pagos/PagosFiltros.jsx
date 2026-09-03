// =========================================================
// FILTROS DE PAGOS — Búsqueda, plan (dinámico), forma, estado,
// fechas, orden y export. El plan se carga desde `planes`.
// =========================================================

import { rangoHoy, rangoMesActual, rangoMesAnterior } from "../../utils/fechas";

function PagosFiltros({
  busquedaPago, setBusquedaPago,
  planes = [], filtroPlan, setFiltroPlan,
  filtroFormaPago, setFiltroFormaPago,
  filtroEstado, setFiltroEstado,
  ordenPagos, setOrdenPagos,
  fechaDesde, setFechaDesde, fechaHasta, setFechaHasta,
  limpiarFiltros, abrirCierreCaja, exportarCSV, exportarPDF, hayResultados,
}) {
  const aplicarRango = ({ desde, hasta }) => {
    setFechaDesde(desde);
    setFechaHasta(hasta);
  };

  return (
    <div className="section-actions" style={{ margin: "1.5rem 0", flexWrap: "wrap" }}>
      <div className="search-box">
        <input
          type="text"
          value={busquedaPago}
          onChange={(e) => setBusquedaPago(e.target.value)}
          placeholder="Buscar por socio, referencia o detalle..."
        />
      </div>

      <div className="filter-group">
        <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value)} className="filter-select">
          <option value="">Plan: Todos</option>
          {planes.map((p) => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>

        <select value={filtroFormaPago} onChange={(e) => setFiltroFormaPago(e.target.value)} className="filter-select">
          <option value="">Forma: Todas</option>
          <option value="1">Efectivo</option>
          <option value="4">Tarjeta débito</option>
          <option value="5">Tarjeta crédito</option>
        </select>

        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="filter-select">
          <option value="">Estado: Todos</option>
          <option value="APROBADO">Aprobados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="RECHAZADO">Rechazados</option>
          <option value="ANULADO">Anulados</option>
        </select>

        <select value={ordenPagos} onChange={(e) => setOrdenPagos(e.target.value)} className="filter-select">
          <option value="fecha_desc">Más recientes</option>
          <option value="fecha_asc">Más antiguos</option>
          <option value="monto_desc">Mayor monto</option>
          <option value="monto_asc">Menor monto</option>
        </select>

        <button type="button" className="quick-range-button" onClick={() => aplicarRango(rangoHoy())}>Hoy</button>
        <button type="button" className="quick-range-button" onClick={() => aplicarRango(rangoMesActual())}>Este mes</button>
        <button type="button" className="quick-range-button" onClick={() => aplicarRango(rangoMesAnterior())}>Mes anterior</button>

        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="filter-date" title="Desde" />
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="filter-date" title="Hasta" />

        <button type="button" className="secondary-button" onClick={limpiarFiltros} title="Limpiar filtros">Limpiar</button>
        <button type="button" className="export-button" onClick={abrirCierreCaja} title="Cierre de caja diario">Cierre de caja</button>
        <button type="button" className="export-button" onClick={exportarCSV} disabled={!hayResultados} title="Exportar a CSV">Exportar CSV</button>
        <button type="button" className="export-button" onClick={exportarPDF} disabled={!hayResultados} title="Exportar resumen a PDF">Exportar PDF</button>
      </div>
    </div>
  );
}

export default PagosFiltros;
