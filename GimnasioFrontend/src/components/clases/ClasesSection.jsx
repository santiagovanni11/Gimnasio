// =========================================================
// CLASES — Sección principal
// Catálogo con horarios e inscriptos. Las desactivadas quedan
// ocultas salvo con "Ver desactivadas". Altas/ediciones en
// modales; la clase elegida despliega horarios e inscriptos.
// =========================================================

import { useMemo, useState } from "react";
import TablaClases from "./TablaClases";
import HorariosPanel from "./HorariosPanel";
import InscripcionesPanel from "./InscripcionesPanel";
import FormularioClaseModal from "./FormularioClaseModal";
import FormularioHorarioModal from "./FormularioHorarioModal";
import FormularioInscripcionModal from "./FormularioInscripcionModal";
import FormularioInscripcionMasivaModal from "./FormularioInscripcionMasivaModal";
import EstadosLista from "../common/EstadosLista";
import ClasesFiltrosPanel from "./ClasesFiltrosPanel";
import ClasesResumenPanel from "./ClasesResumenPanel";
import ClasesMetricasPanel from "./ClasesMetricasPanel";
import { resumenClases, mejoresClases } from "../../utils/clasesOperativas";

function ClasesSection(props) {
  const {
    clases, horarios, inscripciones, socios = [], profesores = [],
    cargando, error, mensaje, setMensaje,
    puedeGestionarClases, puedeEliminarClases,
    puedeGestionarHorarios,
    abrirAltaClase, abrirEdicionClase, eliminarClase,
    abrirAltaHorario, abrirEdicionHorario, eliminarHorario,
    alternarEstadoClase, cancelarInscripcion,
    abrirModalInscripcion,
    abrirInscripcionMasiva,
  } = props;

  const [verInactivas, setVerInactivas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activas");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroProfesor, setFiltroProfesor] = useState("");
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  const clasesVisibles = useMemo(() => {
    const base = filtroEstado === "todas"
      ? clases
      : filtroEstado === "desactivadas"
        ? clases.filter((clase) => clase.activa === false)
        : clases.filter((clase) => clase.activa !== false);

    return base.filter((clase) => {
      const texto = busqueda.toLowerCase().trim();
      const coincideNombre = !texto || (clase.nombre ?? "").toLowerCase().includes(texto);
      const coincideDia = !filtroDia || horarios.some(
        (h) => Number(h.claseId) === Number(clase.id) && Number(h.diaSemana) === Number(filtroDia)
      );
      const coincideProfesor = !filtroProfesor || horarios.some(
        (h) => Number(h.claseId) === Number(clase.id) &&
          `${h.empleadoNombre ?? ""} ${h.empleadoApellido ?? ""}`.trim() === filtroProfesor
      );

      return coincideNombre && coincideDia && coincideProfesor;
    });
  }, [clases, horarios, busqueda, filtroEstado, filtroDia, filtroProfesor]);

  // Si la seleccionada sale del listado visible, cerrar panel
  const vigente =
    claseSeleccionada &&
    clasesVisibles.some((c) => c.id === claseSeleccionada.id)
      ? claseSeleccionada
      : null;

  const horariosDeLaClase = vigente
    ? horarios.filter((h) => h.claseId === vigente.id)
    : [];

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Clases</h2>
          <p>Catálogo de actividades y franjas horarias.</p>
        </div>

        <div className="section-actions">
          <label className="quick-range-button" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={verInactivas}
              onChange={(e) => { setVerInactivas(e.target.checked); setFiltroEstado(e.target.checked ? "todas" : "activas"); }}
              style={{ marginRight: "6px" }} />
            Ver desactivadas
          </label>

          {puedeGestionarClases && (
            <button type="button" className="primary-small-button"
              onClick={() => { setMensaje(""); abrirInscripcionMasiva(); }}>
              + Agregar varios socios
            </button>
          )}

          {puedeGestionarClases && (
            <button type="button" className="primary-small-button"
              onClick={() => { setMensaje(""); abrirAltaClase(); }}>
              + Nueva clase
            </button>
          )}
        </div>
      </div>

      <ClasesResumenPanel resumen={resumenClases(clases, horarios, inscripciones)} />
      <ClasesFiltrosPanel
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroDia={filtroDia}
        setFiltroDia={setFiltroDia}
        filtroProfesor={filtroProfesor}
        setFiltroProfesor={setFiltroProfesor}
        horarios={horarios}
        profesores={profesores}
      />
      <ClasesMetricasPanel
        clases={mejoresClases(clases, horarios, inscripciones)}
        horarios={horarios}
        inscripciones={inscripciones}
      />

      {mensaje && <div className="success-message">{mensaje}</div>}

      <EstadosLista
        cargando={cargando} error={error}
        total={clases.length} filtrados={clasesVisibles.length}
        mensajeCargando="Cargando clases..."
        mensajeVacio="No hay clases registradas."
        mensajeSinResultado="Solo hay clases desactivadas."
      />

      {!cargando && !error && clasesVisibles.length > 0 && (
        <>
          <TablaClases
            clases={clasesVisibles}
            horarios={horarios}
            inscripciones={inscripciones}
            seleccionada={vigente}
            puedeGestionarClases={puedeGestionarClases}
            puedeEliminarClases={puedeEliminarClases}
            onSeleccionar={(clase) => {
              setClaseSeleccionada(clase);
              setHorarioSeleccionado(null);
            }}
            onEditar={(clase) => {
              setMensaje("");
              abrirEdicionClase(clase);
            }}
            onEliminar={eliminarClase}
            onAlternarEstado={alternarEstadoClase}
          />

          {vigente && (
            <HorariosPanel clase={vigente}
              horarios={horariosDeLaClase}
              inscripciones={inscripciones}
              seleccionado={horarioSeleccionado}
              puedeGestionarHorarios={puedeGestionarHorarios}
              onAgregar={() => abrirAltaHorario(vigente)}
              onEditar={abrirEdicionHorario}
              onEliminar={eliminarHorario}
              onVerInscriptos={setHorarioSeleccionado} />
          )}

          {vigente && horarioSeleccionado && (
            <InscripcionesPanel horario={horarioSeleccionado}
              clase={vigente} inscripciones={inscripciones}
              socios={socios} puedeGestionar={puedeGestionarClases}
              onInscribir={() =>
                abrirModalInscripcion({
                  horario: horarioSeleccionado, inscripciones })}
              onCancelar={cancelarInscripcion} />
          )}
        </>
      )}

      <FormularioClaseModal {...props} />
      <FormularioHorarioModal {...props} />
      <FormularioInscripcionModal {...props} />
      <FormularioInscripcionMasivaModal
        {...props}
        socios={socios}
        clases={clases}
        horarios={horarios}
        inscripciones={inscripciones}
      />
    </section>
  );
}

export default ClasesSection;
