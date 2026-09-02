// FORMULARIO DE MEMBRESÍA — Alta/edición/renovación

import SelectorSocioConAviso from "./SelectorSocioConAviso";
import SelectorMetodoPago from "./SelectorMetodoPago";
import { SelectorPlan, SelectorDuracion, CampoSoloLectura } from "./CamposMembresia";
import { useCalculoFormularioMembresia } from "../../hooks/useCalculoFormularioMembresia";
import { aISO, fechaDesdeValor, fechaTexto } from "../../utils/fechas";

function FormularioMembresia({
  membresiaEditando, modoRenovacion, cerrarFormularioMembresia,
  socios, membresias, membresiasRechazadasIds, pagos,
  socioSeleccionado, setSocioSeleccionado, setMembresiaExistente,
  mostrarAvisoMembresiaExistente, setMostrarAvisoMembresiaExistente,
  planSeleccionado, setPlanSeleccionado, planes, cargandoPlanes, errorPlanes,
  duracionMembresia, setDuracionMembresia, calcularFechasMembresia,
  fechaInicioMembresia, fechaFinMembresia,
  setFechaInicioMembresia,
  metodoPagoAlmacenadoId, setMetodoPagoAlmacenadoId,
  crearMembresia, guardandoMembresia,
}) {
  const pagosDelSocio = Array.isArray(pagos)
    ? pagos.filter((p) => Number(p.socioId) === Number(socioSeleccionado))
    : [];

  const { sociosDisponibles, precioMostrado, alCambiarSocio } =
    useCalculoFormularioMembresia({
      socios, membresias, membresiasRechazadasIds, membresiaEditando,
      planes, planSeleccionado, duracionMembresia,
      setSocioSeleccionado, setMembresiaExistente, setMostrarAvisoMembresiaExistente,
    });

  const titulo = modoRenovacion ? "Renovación de membresía"
    : membresiaEditando ? "Editar membresía" : "Nueva membresía";

  const descripcion = modoRenovacion
    ? "Extendé la vigencia: arranca al terminar el período actual."
    : membresiaEditando ? "Actualizá los datos de la membresía."
    : "Completá los datos de la nueva membresía.";

  const aplicarFechaInicioDeRenovacion = () => {
    if (!modoRenovacion || !membresiaEditando?.fechaFin) return;
    setFechaInicioMembresia(aISO(fechaDesdeValor(membresiaEditando.fechaFin)));
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <div><h3>{titulo}</h3><p>{descripcion}</p></div>
        <button type="button" className="close-button" onClick={cerrarFormularioMembresia}>×</button>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label>Socio</label>
          <SelectorSocioConAviso socios={sociosDisponibles} value={socioSeleccionado}
            onSelect={alCambiarSocio} membresias={membresias}
            membresiasRechazadasIds={membresiasRechazadasIds}
            mostrarAviso={mostrarAvisoMembresiaExistente} />
        </div>

        <SelectorPlan planSeleccionado={planSeleccionado} setPlanSeleccionado={setPlanSeleccionado}
          planes={planes} cargandoPlanes={cargandoPlanes} errorPlanes={errorPlanes}
          recalcularFechas={() => calcularFechasMembresia(duracionMembresia)} />

        <SelectorDuracion duracionMembresia={duracionMembresia}
          alCambiar={(meses) => { setDuracionMembresia(meses); calcularFechasMembresia(meses); }} />

        <CampoSoloLectura label="Precio" valor={precioMostrado} />
        <CampoSoloLectura label="Fecha de inicio" valor={fechaInicioMembresia} tipo="date" />
        <CampoSoloLectura label="Fecha de vencimiento" valor={fechaFinMembresia} tipo="date" />
      </div>

      {modoRenovacion && socioSeleccionado && (
        <div className="renovacion-section">
          <SelectorMetodoPago
            socioId={+socioSeleccionado}
            metodoId={metodoPagoAlmacenadoId}
            onChange={setMetodoPagoAlmacenadoId}
            onMetodoSeleccionado={aplicarFechaInicioDeRenovacion}
            pagosDelSocio={pagosDelSocio}
          />
          {membresiaEditando?.fechaFin && (
            <p className="campo-info">
              La renovación arrancará el día {fechaTexto(fechaDesdeValor(fechaInicioMembresia || membresiaEditando.fechaFin))}.
            </p>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={cerrarFormularioMembresia}>Cancelar</button>
        <button type="button" className="primary-small-button" onClick={crearMembresia} disabled={guardandoMembresia}>
          {guardandoMembresia ? "Guardando..." : modoRenovacion ? "Confirmar renovación"
            : membresiaEditando ? "Guardar cambios" : "Guardar membresía"}
        </button>
      </div>
    </div>
  );
}

export default FormularioMembresia;
