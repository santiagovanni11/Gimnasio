// =========================================================
// INSCRIPCIÓN MASIVA — MODAL
// Compone la lista de socios seleccionables y el selector de
// clase/horario (submódulos). La API revalida cupo,
// duplicados y choques de horario socio por socio.
// =========================================================

import { useState } from "react";
import { inscriptosDeHorario } from "../../utils/inscripcionesClase";
import { sociosConChoqueHorario } from "../../utils/choqueHorario";
import AvisoChoqueHorario from "./AvisoChoqueHorario";
import ListaSocioSeleccionable from "./ListaSocioSeleccionable";
import SelectorClaseHorario from "./SelectorClaseHorario";

function FormularioInscripcionMasivaModal({
  inscripcionMasivaAbierta,
  socios = [],
  clases = [],
  horarios = [],
  inscripciones = [],
  seleccionIdsMasiva,
  alternarSocioMasiva,
  claseDestinoMasiva,
  seleccionarClaseMasiva,
  horarioDestinoMasiva,
  seleccionarHorarioMasiva,
  fechaVigenciaMasiva,
  seleccionarFechaVigenciaMasiva,
  guardandoInscripcionMasiva,
  errorInscripcionMasiva,
  cerrarInscripcionMasiva,
  guardarInscripcionMasiva,
}) {
  const [cupo, setCupo] = useState(null);

  if (!inscripcionMasivaAbierta) return null;

  const sinCupo =
    cupo && seleccionIdsMasiva.length > cupo.libres;

  const horarioElegido = horarios.find(
    (h) => Number(h.id) === Number(horarioDestinoMasiva)
  );

  const choqueIds = sociosConChoqueHorario(
    inscripciones, horarios, horarioElegido
  );

  const ocupadosIds = new Set([
    ...inscriptosDeHorario(
      inscripciones, horarioDestinoMasiva
    ).map((i) => Number(i.socioId)),
    ...choqueIds,
  ]);

  return (
    <div className="payment-modal-backdrop"
      onClick={cerrarInscripcionMasiva}>
      <div className="payment-modal payment-modal-amplia"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">INSCRIPCIONES</span>
            <h3>Agregar varios socios</h3>
            <p>Elegí los socios y después la clase.</p>
          </div>

          <button type="button" className="close-button"
            onClick={cerrarInscripcionMasiva}>
            ×
          </button>
        </div>

        <form onSubmit={guardarInscripcionMasiva}>
          <div className="payment-ticket-body">
            <ListaSocioSeleccionable
              socios={socios}
              ocupadosIds={ocupadosIds}
              seleccionIds={seleccionIdsMasiva}
              alternarSocio={alternarSocioMasiva}
            />

            <AvisoChoqueHorario idsConChoque={choqueIds} />

            <SelectorClaseHorario
              clases={clases}
              horarios={horarios}
              inscripciones={inscripciones}
              claseDestino={claseDestinoMasiva}
              seleccionarClase={seleccionarClaseMasiva}
              horarioDestino={horarioDestinoMasiva}
              seleccionarHorario={seleccionarHorarioMasiva}
              cantidadSeleccionada={seleccionIdsMasiva.length}
              onCupo={setCupo}
            />

            <div className="input-group">
              <label>Vigente hasta (opcional)</label>
              <input type="date" value={fechaVigenciaMasiva ?? ""}
                onChange={(e) =>
                  seleccionarFechaVigenciaMasiva(
                    e.target.value)}
                title="Si se define, al pasar la fecha deja de ocupar cupo"
              />
            </div>

            {errorInscripcionMasiva && (
              <p className="error-message">
                {errorInscripcionMasiva}
              </p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button type="button" className="secondary-button"
              onClick={cerrarInscripcionMasiva}>
              Cancelar
            </button>

            <button type="submit"
              className="primary-small-button"
              disabled={guardandoInscripcionMasiva ||
                !seleccionIdsMasiva.length ||
                !horarioDestinoMasiva || sinCupo}>
              {guardandoInscripcionMasiva
                ? "Inscribiendo..."
                : "Confirmar inscripciones"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioInscripcionMasivaModal;