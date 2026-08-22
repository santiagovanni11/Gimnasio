// =========================================================
// PRECIOS — Configuración por plan y duración
// Tabla en TablaPrecios; reglas en utils/preciosConfig;
// estado y persistencia en usePlanes. Export a CSV incluido.
// =========================================================

import TablaPrecios from "./TablaPrecios";
import FormularioNuevoPlan from "./FormularioNuevoPlan";
import HistorialPreciosModal from "./HistorialPreciosModal";
import { useNuevoPlan } from "../../hooks/useNuevoPlan";
import { exportarPlanesCsv } from "../../utils/exportar/planesExportarCsv";

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

  /** entrando=true → editar; false → cancelar y restaurar. */
  const cancelarEdicionPrecios = (entrando = false, planId = null) => {
    setErrorPrecios("");
    setMensajePrecios("");

    if (entrando) {
      setPlanEditando(planId);
      return;
    }

    prepararPreciosEditando();
    setPlanEditando(null);
  };

  const nuevoPlan = useNuevoPlan({
    alCrear: async (texto) => {
      await obtenerPlanes();
      setMensajePrecios(texto);
    },
  });

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Configuración de precios</h2>
          <p>Administrá los precios de cada plan y período.</p>
        </div>

        <div className="section-actions">
          <button
            type="button"
            className="primary-small-button"
            onClick={nuevoPlan.abrirNuevoPlan}
          >
            + Nuevo plan
          </button>

          <button
            type="button"
            className="export-button"
            onClick={() => exportarPlanesCsv(planes)}
            disabled={!planes.length}
            title="Exportar tabla de precios a CSV"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {mensajePrecios && (
        <div className="success-message">{mensajePrecios}</div>
      )}

      {errorPrecios && (
        <div className="error-message">{errorPrecios}</div>
      )}

      {cargandoPlanes && (
        <div className="info-message">Cargando planes...</div>
      )}

      {!cargandoPlanes && errorPlanes && (
        <div className="error-message">{errorPlanes}</div>
      )}

      {!cargandoPlanes && !errorPlanes && !planes.length && (
        <div className="empty-state">No hay planes disponibles.</div>
      )}

      {!cargandoPlanes &&
        !errorPlanes &&
        planes.length > 0 && (
          <TablaPrecios
            planes={planes}
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
          />
        )}

      <FormularioNuevoPlan {...nuevoPlan} />

      <HistorialPreciosModal
        plan={planHistorial}
        filas={filasHistorial}
        cargando={cargandoHistorial}
        onClose={cerrarHistorial}
      />
    </section>
  );
}

export default PreciosSeccion;
