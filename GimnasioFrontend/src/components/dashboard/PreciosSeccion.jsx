// PRECIOS — Configuración por plan y duración
import TablaPrecios from "./TablaPrecios";
import TarjetasResumenPrecios from "./TarjetasResumenPrecios";
import FiltrosPrecios from "./FiltrosPrecios";
import { useFiltrosPrecios } from "../../hooks/useFiltrosPrecios";
import FormularioNuevoPlan from "./FormularioNuevoPlan";
import HistorialPreciosModal from "./HistorialPreciosModal";
import AvisoCambiosProgramados from "./AvisoCambiosProgramados";
import BotonesExportarPrecios from "./BotonesExportarPrecios";
import EstadoVacio from "../common/EstadoVacio";
import EditorBeneficiosClasesPlan from "./EditorBeneficiosClasesPlan";
import PreciosVigenciaPanel from "./PreciosVigenciaPanel";
import PreciosAuditoriaPanel from "./PreciosAuditoriaPanel";
import PreciosReglasPanel from "./PreciosReglasPanel";
import { useNuevoPlan } from "../../hooks/useNuevoPlan";
import { useEditorBeneficiosClases } from "../../hooks/useEditorBeneficiosClases";

function PreciosSeccion(props) {
  const {
    mensajePrecios,
    errorPrecios,
    setMensajePrecios,
    setErrorPrecios,
    setPlanEditando,
    planes,
    obtenerPlanes,
    cargandoPlanes,
    errorPlanes,
    preciosEditando,
    setPreciosEditando,
    planEditando,
    guardandoPrecios,
    guardarPreciosPlan,
    prepararPreciosEditando,
    validarCelda,
    fechaRige,
    setFechaRige,
    alternarEstadoPlan,
    duplicarPlan,
    eliminarPlan,
    verHistorial,
    planHistorial,
    filasHistorial,
    cargandoHistorial,
    cerrarHistorial,
  } = props;

  const {
    busqueda: busquedaPlanes,
    setBusqueda: setBusquedaPlanes,
    filtroEstado: filtroEstadoPlanes,
    setFiltroEstado: setFiltroEstadoPlanes,
    planesFiltrados,
  } = useFiltrosPrecios(planes);

  const cancelarEdicionPrecios = (entrando = false, planId = null) => {
    setErrorPrecios("");
    setMensajePrecios("");
    if (entrando) { setPlanEditando(planId); return; }
    prepararPreciosEditando();
    setPlanEditando(null);
  };

  const nuevoPlan = useNuevoPlan({ alCrear: async (texto) => { await obtenerPlanes(); setMensajePrecios(texto); } });

  const editorBeneficios = useEditorBeneficiosClases({
    onSesionExpirada: props.cerrarSesion,
    setMensaje: setMensajePrecios,
    setError: setErrorPrecios,
    alExito: obtenerPlanes,
  });

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Configuración de precios</h2>
          <p>Administrá los precios de cada plan y período.</p>
        </div>

        <div className="section-actions">
          <button type="button" className="primary-small-button" onClick={nuevoPlan.abrirNuevoPlan}>+ Nuevo plan</button>

          <BotonesExportarPrecios planes={planes} />
        </div>
      </div>

      <TarjetasResumenPrecios planes={planes} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <PreciosVigenciaPanel planes={planes} />
        <PreciosAuditoriaPanel planes={planes} filasHistorial={filasHistorial} />
        <PreciosReglasPanel planes={planes} membresias={props.membresias ?? []} />
      </div>

      <FiltrosPrecios
        busqueda={busquedaPlanes}
        setBusqueda={setBusquedaPlanes}
        filtroEstado={filtroEstadoPlanes}
        setFiltroEstado={setFiltroEstadoPlanes}
      />

      {mensajePrecios && <div className="success-message">{mensajePrecios}</div>}
      {errorPrecios && <div className="error-message">{errorPrecios}</div>}
      {cargandoPlanes && <div className="info-message">Cargando planes...</div>}
      {!cargandoPlanes && errorPlanes && <div className="error-message">{errorPlanes}</div>}

      {!cargandoPlanes && !errorPlanes && !planes.length && (
        <EstadoVacio
          tipo="precios"
          titulo="Sin planes configurados"
          mensaje="Creá el primer plan y definí sus precios por duración."
        />
      )}

      {!cargandoPlanes && !errorPlanes && planes.length > 0 && (
        planesFiltrados.length > 0 ? (
          <TablaPrecios
            planes={planesFiltrados}
            membresias={props.membresias}
            preciosEditando={preciosEditando}
            setPreciosEditando={setPreciosEditando}
            planEditando={planEditando}
            guardandoPrecios={guardandoPrecios}
            guardarPreciosPlan={guardarPreciosPlan}
            cancelarEdicionPrecios={cancelarEdicionPrecios}
            validarCelda={validarCelda}
            fechaRige={fechaRige}
            setFechaRige={setFechaRige}
            onAlternarEstado={alternarEstadoPlan}
            onDuplicar={duplicarPlan}
            onVerHistorial={verHistorial}
            onEliminar={eliminarPlan}
            onEditarBeneficios={editorBeneficios.abrir}
          />
        ) : (
          <EstadoVacio
            tipo="precios"
            titulo="Sin resultados"
            mensaje="Ningún plan coincide con la búsqueda o el filtro seleccionado."
          />
        )
      )}

      <FormularioNuevoPlan {...nuevoPlan} />

      <AvisoCambiosProgramados
        notificar={setMensajePrecios}
        avisarError={setErrorPrecios}
      />

      <HistorialPreciosModal
        plan={planHistorial}
        filas={filasHistorial}
        cargando={cargandoHistorial}
        onClose={cerrarHistorial}
      />

      <EditorBeneficiosClasesPlan {...editorBeneficios} />
    </section>
  );
}

export default PreciosSeccion;
