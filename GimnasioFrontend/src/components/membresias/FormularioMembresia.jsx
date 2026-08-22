// =========================================================
// FORMULARIO DE MEMBRÉSÍA — Alta/edición/renovación
// Composición pura: socio en SelectorSocioConAviso, campos
// reutilizables en CamposMembresia, cálculos en
// useCalculoFormularioMembresia.
// =========================================================

import SelectorSocioConAviso from "./SelectorSocioConAviso";
import {
  SelectorPlan,
  SelectorDuracion,
  CampoSoloLectura,
} from "./CamposMembresia";
import { useCalculoFormularioMembresia } from "../../hooks/useCalculoFormularioMembresia";

function FormularioMembresia({
  membresiaEditando,
  modoRenovacion,
  cerrarFormularioMembresia,
  socios,
  membresias,
  membresiasRechazadasIds,
  socioSeleccionado,
  setSocioSeleccionado,
  setMembresiaExistente,
  mostrarAvisoMembresiaExistente,
  setMostrarAvisoMembresiaExistente,
  planSeleccionado,
  setPlanSeleccionado,
  planes,
  cargandoPlanes,
  errorPlanes,
  duracionMembresia,
  setDuracionMembresia,
  calcularFechasMembresia,
  fechaInicioMembresia,
  fechaFinMembresia,
  crearMembresia,
  guardandoMembresia,
}) {
  const { sociosDisponibles, precioMostrado, alCambiarSocio } =
    useCalculoFormularioMembresia({
      socios,
      membresias,
      membresiasRechazadasIds,
      membresiaEditando,
      planes,
      planSeleccionado,
      duracionMembresia,
      setSocioSeleccionado,
      setMembresiaExistente,
      setMostrarAvisoMembresiaExistente,
    });

  const titulo = modoRenovacion
    ? "Renovación de membresía"
    : membresiaEditando
    ? "Editar membresía"
    : "Nueva membresía";

  const descripcion = modoRenovacion
    ? "Extendé la vigencia de la misma membresía: arranca al terminar el período actual."
    : membresiaEditando
    ? "Actualizá los datos de la membresía seleccionada."
    : "Completá los datos de la nueva membresía.";

  return (
    <div className="form-card">
      <div className="form-card-header">
        <div>
          <h3>{titulo}</h3>
          <p>{descripcion}</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={cerrarFormularioMembresia}
        >
          ×
        </button>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label>Socio</label>

          <SelectorSocioConAviso
            socios={sociosDisponibles}
            value={socioSeleccionado}
            onSelect={alCambiarSocio}
            membresias={membresias}
            membresiasRechazadasIds={membresiasRechazadasIds}
            mostrarAviso={mostrarAvisoMembresiaExistente}
          />
        </div>

        <SelectorPlan
          planSeleccionado={planSeleccionado}
          setPlanSeleccionado={setPlanSeleccionado}
          planes={planes}
          cargandoPlanes={cargandoPlanes}
          errorPlanes={errorPlanes}
          recalcularFechas={() =>
            calcularFechasMembresia(duracionMembresia)
          }
        />

        <SelectorDuracion
          duracionMembresia={duracionMembresia}
          alCambiar={(meses) => {
            setDuracionMembresia(meses);
            calcularFechasMembresia(meses);
          }}
        />

        <CampoSoloLectura label="Precio" valor={precioMostrado} />
        <CampoSoloLectura label="Fecha de inicio" valor={fechaInicioMembresia} tipo="date" />
        <CampoSoloLectura label="Fecha de vencimiento" valor={fechaFinMembresia} tipo="date" />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={cerrarFormularioMembresia}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="primary-small-button"
          onClick={crearMembresia}
          disabled={guardandoMembresia}
        >
          {guardandoMembresia
            ? "Guardando..."
            : modoRenovacion
            ? "Confirmar renovación"
            : membresiaEditando
            ? "Guardar cambios"
            : "Guardar membresía"}
        </button>
      </div>
    </div>
  );
}

export default FormularioMembresia;
