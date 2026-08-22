// =========================================================
// MEMBRESÍAS — Sección principal
// Compone filtros, formulario y tabla. Los filtros de
// estado/vencimiento y el orden viven en
// useVisibilidadMembresias.
// =========================================================

import FormularioMembresia from "./FormularioMembresia";
import TablaMembresias from "./TablaMembresias";
import MembresiasFiltros from "./MembresiasFiltros";
import EstadosLista from "../common/EstadosLista";
import { useVisibilidadMembresias } from "../../hooks/useVisibilidadMembresias";
import { exportarMembresiasCsv } from "../../utils/membresias";

function MembresiasSection(props) {
  const {
    puedeCrearSocios,
    setMensaje, setErrorMembresias,
    setMostrarFormularioMembresia, mostrarFormularioMembresia,
    membresiaEditando, cerrarFormularioMembresia,
    abrirEdicionMembresia, cancelarMembresia,
    suspenderMembresia, reactivarMembresia,
    eliminarMembresia,
    prepararRenovacionMembresia, obtenerPlanes,
    socioSeleccionado, setSocioSeleccionado,
    membresias, membresiasFiltradas, membresiasRechazadasIds,
    planes, cargandoPlanes, errorPlanes,
    setMembresiaExistente, setMostrarAvisoMembresiaExistente,
    membresiaExistente, mostrarAvisoMembresiaExistente,
    socios, planSeleccionado, setPlanSeleccionado,
    calcularFechasMembresia, duracionMembresia, setDuracionMembresia,
    fechaInicioMembresia, fechaFinMembresia,
    crearMembresia, guardandoMembresia,
    cargandoMembresias, errorMembresias,
    busquedaMembresia, setBusquedaMembresia,
  } = props;

  const {
    filtroEstado, setFiltroEstado,
    filtroVencimiento, setFiltroVencimiento,
    orden, toggleOrden, membresiasVisibles,
  } = useVisibilidadMembresias(membresiasFiltradas);

  const abrirNuevaMembresia = () => {
    setMensaje("");
    setErrorMembresias("");
    cerrarFormularioMembresia();
    setMostrarFormularioMembresia(true);
    obtenerPlanes();
  };

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Membresías</h2>
          <p>Membresías registradas en el gimnasio.</p>
        </div>

        {puedeCrearSocios && (
          <div className="section-actions">
            <button
              type="button"
              className="export-button"
              onClick={() => exportarMembresiasCsv(membresiasVisibles)}
              disabled={!membresiasVisibles.length}
              title="Exportar listado a CSV"
            >
              Exportar CSV
            </button>

            <button
              type="button"
              className="primary-small-button"
              onClick={abrirNuevaMembresia}
            >
              + Nueva membresía
            </button>
          </div>
        )}
      </div>

      <MembresiasFiltros
        busquedaMembresia={busquedaMembresia}
        setBusquedaMembresia={setBusquedaMembresia}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroVencimiento={filtroVencimiento}
        setFiltroVencimiento={setFiltroVencimiento}
      />

      {mostrarFormularioMembresia && (
        <FormularioMembresia
          membresiaEditando={membresiaEditando}
          cerrarFormularioMembresia={cerrarFormularioMembresia}
          socios={socios}
          membresias={membresias}
          membresiasRechazadasIds={membresiasRechazadasIds}
          socioSeleccionado={socioSeleccionado}
          setSocioSeleccionado={setSocioSeleccionado}
          membresiaExistente={membresiaExistente}
          setMembresiaExistente={setMembresiaExistente}
          mostrarAvisoMembresiaExistente={mostrarAvisoMembresiaExistente}
          setMostrarAvisoMembresiaExistente={setMostrarAvisoMembresiaExistente}
          planSeleccionado={planSeleccionado}
          setPlanSeleccionado={setPlanSeleccionado}
          planes={planes}
          cargandoPlanes={cargandoPlanes}
          errorPlanes={errorPlanes}
          duracionMembresia={duracionMembresia}
          setDuracionMembresia={setDuracionMembresia}
          calcularFechasMembresia={calcularFechasMembresia}
          fechaInicioMembresia={fechaInicioMembresia}
          fechaFinMembresia={fechaFinMembresia}
          crearMembresia={crearMembresia}
          guardandoMembresia={guardandoMembresia}
        />
      )}

      <EstadosLista
        cargando={cargandoMembresias}
        error={errorMembresias}
        total={membresias.length}
        filtrados={membresiasVisibles.length}
        mensajeCargando="Cargando membresías..."
        mensajeVacio="No hay membresías registradas."
        mensajeSinResultado="No se encontraron membresías para los filtros seleccionados."
      />

      {!cargandoMembresias && !errorMembresias && membresiasVisibles.length > 0 && (
        <TablaMembresias
          membresias={membresiasVisibles}
          orden={orden}
          toggleOrden={toggleOrden}
          abrirEdicionMembresia={abrirEdicionMembresia}
          prepararRenovacionMembresia={prepararRenovacionMembresia}
          suspenderMembresia={suspenderMembresia}
          reactivarMembresia={reactivarMembresia}
          cancelarMembresia={cancelarMembresia}
          eliminarMembresia={eliminarMembresia}
        />
      )}
    </section>
  );
}

export default MembresiasSection;
