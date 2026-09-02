// =========================================================
// FORMULARIO DE INSCRIPCIÓN — MODAL
// Selector de socios activos disponibles para el horario
// (excluye ya inscriptos), con búsqueda por nombre, apellido
// o DNI. Cupo y duplicados los revalida la API.
// =========================================================

import { useState } from "react";
import { diaSemanaTexto, franjaTexto } from "../../utils/clases";
import { sociosConChoqueHorario } from "../../utils/choqueHorario";
import AvisoChoqueHorario from "./AvisoChoqueHorario";

function FormularioInscripcionModal({
  inscripcionModalAbierta,
  horarioDestino,
  inscriptosActuales,
  socioSeleccionado,
  seleccionarSocio,
  fechaHastaVigencia,
  seleccionarFechaHasta,
  guardandoInscripcion,
  errorInscripcion,
  socios = [],
  horarios = [],
  inscripciones = [],
  cerrarModalInscripcion,
  guardarInscripcion,
}) {
  const [busqueda, setBusqueda] = useState("");

  if (!inscripcionModalAbierta) return null;

  const idsOcupados = new Set(
    inscriptosActuales.map((i) => Number(i.socioId)));

  const choqueIds = sociosConChoqueHorario(
    inscripciones, horarios, horarioDestino);

  const texto = busqueda.trim().toLowerCase();

  const disponibles = socios.filter(
    (socio) =>
      socio.activo !== false &&
      !socio.sinAccesoAClases &&
      !idsOcupados.has(Number(socio.id)) &&
      !choqueIds.has(Number(socio.id)) &&
      (!texto ||
        [socio.nombre, socio.apellido, socio.dni]
          .filter(Boolean)
          .some((v) =>
            String(v).toLowerCase().includes(texto)))
  );

  return (
    <div className="payment-modal-backdrop"
      onClick={cerrarModalInscripcion}>
      <div className="payment-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">INSCRIPCIONES</span>
            <h3>Inscribir socio</h3>
            {horarioDestino && (
              <p>
                {horarioDestino.claseNombre} ·{" "}
                {diaSemanaTexto(horarioDestino.diaSemana)}{" "}
                {franjaTexto(horarioDestino.horaInicio, horarioDestino.horaFin)}
              </p>
            )}
          </div>

          <button type="button" className="close-button"
            onClick={cerrarModalInscripcion}>
            ×
          </button>
        </div>

        <form onSubmit={guardarInscripcion}>
          <div className="payment-ticket-body">
            <div className="input-group">
              <label>Buscar socio</label>
              <input type="search" value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, apellido o DNI…"
                autoFocus />
            </div>

            <div className="input-group">
              <label>Socio</label>
              <select value={socioSeleccionado}
                onChange={(e) =>
                  seleccionarSocio(e.target.value)}
                required>
                <option value="" disabled>
                  Seleccioná un socio…
                </option>
                {disponibles.map((socio) => (
                  <option key={socio.id} value={socio.id}>
                    {socio.nombre} {socio.apellido}{" "}
                    {socio.dni ? `· DNI ${socio.dni}` : ""}
                  </option>
                ))}
              </select>

              {!disponibles.length && (
                <small className="error-message">
                  No hay socios activos disponibles.
                </small>
              )}
              <AvisoChoqueHorario idsConChoque={choqueIds} />
            </div>

            <div className="input-group">
              <label>Vigente hasta (opcional)</label>
              <input type="date" value={fechaHastaVigencia ?? ""}
                onChange={(e) =>
                  seleccionarFechaHasta(e.target.value)}
                title="Si se define, al pasar la fecha deja de ocupar cupo" />
            </div>

            {errorInscripcion && (
              <p className="error-message">{errorInscripcion}</p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button type="button" className="secondary-button"
              onClick={cerrarModalInscripcion}>
              Cancelar
            </button>

            <button type="submit"
              className="primary-small-button"
              disabled={
                guardandoInscripcion || !disponibles.length
              }
            >
              {guardandoInscripcion
                ? "Inscribiendo..."
                : "Confirmar inscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioInscripcionModal;