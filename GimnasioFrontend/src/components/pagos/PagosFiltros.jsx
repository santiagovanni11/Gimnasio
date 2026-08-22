// =========================================================
// FILTROS DE PAGOS — Búsqueda, plan, forma, fechas y export
// =========================================================

import { rangoHoy, rangoMesActual, rangoMesAnterior } from "../../utils/fechas";

function PagosFiltros({
  busquedaPago,
  setBusquedaPago,
  filtroPlan,
  setFiltroPlan,
  filtroFormaPago,
  setFiltroFormaPago,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  limpiarFiltros,
  abrirCierreCaja,
  exportarCSV,
  exportarPDF,
  hayResultados,
}) {
  const aplicarRango = ({ desde, hasta }) => {
    setFechaDesde(desde);
    setFechaHasta(hasta);
  };

  return (
    <div className="section-actions" style={{ margin: "1.5rem 0" }}>
      <div className="search-box" style={{ minWidth: "240px" }}>
        <input
          type="text"
          value={busquedaPago}
          onChange={(event) => setBusquedaPago(event.target.value)}
          placeholder="Buscar por socio, referencia o detalle..."
        />
      </div>

      <div className="filter-group">
        <select
          value={filtroPlan}
          onChange={(event) => setFiltroPlan(event.target.value)}
          className="filter-select"
        >
          <option value="">Todas</option>
          <option value="premium">Premium</option>
          <option value="basico">Básico</option>
        </select>

        <select
          value={filtroFormaPago}
          onChange={(event) => setFiltroFormaPago(event.target.value)}
          className="filter-select"
        >
          <option value="">Forma: Todas</option>
          <option value="1">Efectivo</option>
          <option value="4">Tarjeta débito</option>
          <option value="5">Tarjeta crédito</option>
        </select>

        <div className="quick-range-group">
          <button
            type="button"
            className="quick-range-button"
            onClick={() => aplicarRango(rangoHoy())}
          >
            Hoy
          </button>

          <button
            type="button"
            className="quick-range-button"
            onClick={() => aplicarRango(rangoMesActual())}
          >
            Este mes
          </button>

          <button
            type="button"
            className="quick-range-button"
            onClick={() => aplicarRango(rangoMesAnterior())}
          >
            Mes anterior
          </button>
        </div>

        <input
          type="date"
          value={fechaDesde}
          onChange={(event) => setFechaDesde(event.target.value)}
          className="filter-date"
          title="Desde"
        />

        <input
          type="date"
          value={fechaHasta}
          onChange={(event) => setFechaHasta(event.target.value)}
          className="filter-date"
          title="Hasta"
        />

        <button
          type="button"
          className="secondary-button"
          onClick={limpiarFiltros}
          title="Limpiar filtros"
        >
          Limpiar
        </button>

        <button
          type="button"
          className="export-button"
          onClick={abrirCierreCaja}
          title="Cierre de caja diario"
        >
          Cierre de caja
        </button>

        <button
          type="button"
          className="export-button"
          onClick={exportarCSV}
          disabled={!hayResultados}
          title="Exportar a CSV"
        >
          Exportar CSV
        </button>

        <button
          type="button"
          className="export-button"
          onClick={exportarPDF}
          disabled={!hayResultados}
          title="Exportar resumen a PDF"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
}

export default PagosFiltros;
