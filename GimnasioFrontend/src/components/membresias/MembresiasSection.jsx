// =========================================================
// MEMBRESÍAS — Sección principal
// Compone encabezado, resumen, recuperación, filtros,
// formulario y tabla. Filtros/orden en
// useVisibilidadMembresias; detalle en DetalleMembresiaModal.
// =========================================================

import { useState } from "react";
import EncabezadoMembresias from "./EncabezadoMembresias";
import TarjetasResumenMembresias from "./TarjetasResumenMembresias";
import RecuperacionPanel from "./RecuperacionPanel";
import FormularioMembresia from "./FormularioMembresia";
import TablaMembresias from "./TablaMembresias";
import MembresiasFiltros from "./MembresiasFiltros";
import DetalleMembresiaModal from "./DetalleMembresiaModal";
import ProximosVencimientos from "./ProximosVencimientos";
import ResumenIngresosMembresias from "./ResumenIngresosMembresias";
import AuditoriaMembresias from "./AuditoriaMembresias";
import EstadosLista from "../common/EstadosLista";
import { useVisibilidadMembresias } from "../../hooks/useVisibilidadMembresias";

function MembresiasSection(props) {
  const {
    puedeCrearSocios,
    setMensaje, setErrorMembresias,
    setMostrarFormularioMembresia, mostrarFormularioMembresia,
    membresiaEditando, cerrarFormularioMembresia,
    abrirEdicionMembresia, cancelarMembresia,
    suspenderMembresia, reactivarMembresia,
    eliminarMembresia,
    renovarRapido, obtenerPlanes,
    socioSeleccionado, setSocioSeleccionado,
    membresias, membresiasFiltradas, membresiasRechazadasIds,
    planes, cargandoPlanes, errorPlanes,
    setMembresiaExistente, setMostrarAvisoMembresiaExistente,
    membresiaExistente, mostrarAvisoMembresiaExistente,
    socios, planSeleccionado, setPlanSeleccionado,
    calcularFechasMembresia, duracionMembresia, setDuracionMembresia,
    fechaInicioMembresia, setFechaInicioMembresia, fechaFinMembresia,
    crearMembresia, guardandoMembresia,
    metodoPagoAlmacenadoId, setMetodoPagoAlmacenadoId,
    modoRenovacion,
    cargandoMembresias, errorMembresias,
    busquedaMembresia, setBusquedaMembresia,
    pagos,
  } = props;

  const [membreDetalle, setMembreDetalle] = useState(null);
  const [seleccionadas, setSeleccionadas] = useState([]);

  const {
    filtroEstado, setFiltroEstado,
    filtroVencimiento, setFiltroVencimiento,
    filtroPlan, setFiltroPlan,
    orden, toggleOrden, membresiasVisibles,
  } = useVisibilidadMembresias(membresiasFiltradas);

  const abrirNuevaMembresia = () => {
    setMensaje("");
    setErrorMembresias("");
    cerrarFormularioMembresia();
    setMostrarFormularioMembresia(true);
    obtenerPlanes();
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(Number(id))
        ? prev.filter((item) => item !== Number(id))
        : [...prev, Number(id)]
    );
  };

  const renovarSeleccionadas = async () => {
    if (!seleccionadas.length) return;
    for (const id of seleccionadas) {
      const membresia = membresias.find((item) => Number(item.id) === Number(id));
      if (membresia) await renovarRapido(membresia);
    }
    setSeleccionadas([]);
  };

  return (
    <>
      <section className="content-card">
        <EncabezadoMembresias
          puedeCrear={puedeCrearSocios}
          membresiasVisibles={membresiasVisibles}
          alAbrirNueva={abrirNuevaMembresia}
        />
        <TarjetasResumenMembresias membresias={membresiasVisibles} />
      </section>

      <section className="content-card">
        <MembresiasFiltros
          busquedaMembresia={busquedaMembresia}
          setBusquedaMembresia={setBusquedaMembresia}
          filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado}
          filtroVencimiento={filtroVencimiento} setFiltroVencimiento={setFiltroVencimiento}
          planes={planes} filtroPlan={filtroPlan} setFiltroPlan={setFiltroPlan}
        />
      </section>

      <RecuperacionPanel membresias={membresias} onRenovar={renovarRapido} />
      <ProximosVencimientos membresias={membresias} onRenovar={renovarRapido} />
      <ResumenIngresosMembresias membresias={membresias} pagos={pagos ?? []} />

      {seleccionadas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0.75rem 0" }}>
          <small style={{ color: "var(--texto-muted)" }}>
            Las casillas marcadas se utilizan para renovar varias membresías a la vez.
          </small>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" className="primary-small-button" onClick={renovarSeleccionadas}>
              Renovar seleccionadas ({seleccionadas.length})
            </button>
            <button type="button" className="secondary-button" onClick={() => setSeleccionadas([])}>
              Limpiar selección
            </button>
          </div>
        </div>
      )}

      {mostrarFormularioMembresia && (
        <FormularioMembresia
          membresiaEditando={membresiaEditando}
          cerrarFormularioMembresia={cerrarFormularioMembresia}
          socios={socios} membresias={membresias} pagos={pagos}
          membresiasRechazadasIds={membresiasRechazadasIds}
          socioSeleccionado={socioSeleccionado} setSocioSeleccionado={setSocioSeleccionado}
          membresiaExistente={membresiaExistente} setMembresiaExistente={setMembresiaExistente}
          mostrarAvisoMembresiaExistente={mostrarAvisoMembresiaExistente} setMostrarAvisoMembresiaExistente={setMostrarAvisoMembresiaExistente}
          planSeleccionado={planSeleccionado} setPlanSeleccionado={setPlanSeleccionado}
          planes={planes} cargandoPlanes={cargandoPlanes} errorPlanes={errorPlanes}
          duracionMembresia={duracionMembresia} setDuracionMembresia={setDuracionMembresia}
          calcularFechasMembresia={calcularFechasMembresia}
          fechaInicioMembresia={fechaInicioMembresia} fechaFinMembresia={fechaFinMembresia}
          setFechaInicioMembresia={setFechaInicioMembresia}
          metodoPagoAlmacenadoId={metodoPagoAlmacenadoId} setMetodoPagoAlmacenadoId={setMetodoPagoAlmacenadoId}
          modoRenovacion={modoRenovacion}
          crearMembresia={crearMembresia} guardandoMembresia={guardandoMembresia}
        />
      )}

      <section className="content-card">
        <EstadosLista
          cargando={cargandoMembresias} error={errorMembresias}
          total={membresias.length} filtrados={membresiasVisibles.length}
          mensajeCargando="Cargando membresías..."
          mensajeVacio="No hay membresías registradas."
          mensajeSinResultado="No se encontraron membresías para los filtros seleccionados."
        />
        {!cargandoMembresias && !errorMembresias && membresiasVisibles.length > 0 && (
          <TablaMembresias
            membresias={membresiasVisibles} orden={orden} toggleOrden={toggleOrden}
            abrirEdicionMembresia={abrirEdicionMembresia}
            prepararRenovacionMembresia={renovarRapido}
            suspenderMembresia={suspenderMembresia} reactivarMembresia={reactivarMembresia}
            cancelarMembresia={cancelarMembresia} eliminarMembresia={eliminarMembresia}
            verDetalle={setMembreDetalle}
            seleccionadas={seleccionadas}
            onToggleSeleccion={toggleSeleccion}
            pagos={pagos ?? []}
          />
        )}
      </section>

      <AuditoriaMembresias membresias={membresias} />

      {membreDetalle && (
        <DetalleMembresiaModal
          membresia={membreDetalle} membresias={membresias}
          pagos={pagos ?? []} onClose={() => setMembreDetalle(null)}
        />
      )}
    </>
  );
}

export default MembresiasSection;
