// =========================================================
// FORMULARIO DE INSCRIPCIÓN A UN HORARIO
// Selector de socio activo (excluye ya inscriptos). La
// capacidad y los duplicados los revalida la API.
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { inscriptosDeHorario } from "../utils/inscripcionesClase";
import { hoyISO } from "../utils/fechas";

export function useFormularioInscripcion({
  onSesionExpirada,
  obtenerTodo,
  notificar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [horarioDestino, setHorarioDestino] = useState(null);
  const [inscriptosActuales, setInscriptosActuales] = useState(
    []
  );
  const [socioId, setSocioId] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  /**
   * Abre el modal para un horario. inscripciones: para
   * excluir del selector a quienes ya ocupan cupo.
   */
  const abrir = ({ horario, inscripciones }) => {
    setHorarioDestino(horario);
    setInscriptosActuales(
      inscriptosDeHorario(inscripciones, horario.id)
    );
    setSocioId("");
    setFechaHasta("");
    setError("");
    setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  const guardar = async (event) => {
    event.preventDefault();

    if (!socioId) {
      setError("Seleccioná un socio.");
      return;
    }

    if (fechaHasta && fechaHasta < hoyISO()) {
      setError("La vigencia no puede ser una fecha pasada.");
      return;
    }

    setGuardando(true);
    setError("");

    const resultado = await ejecutar({
      peticion: () =>
        clasesService.inscribir({
          socioId: Number(socioId),
          horarioClaseId: horarioDestino.id,
          fechaHasta: fechaHasta || null,
        }),
      onError: setError,
      mensajePermiso:
        "No tenés permisos para gestionar inscripciones.",
      mensajeError: "No se pudo completar la inscripción.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al inscribir:",
    });

    setGuardando(false);

    if (!resultado) return;

    setAbierto(false);

    await obtenerTodo?.();
    notificar?.("Socio inscripto correctamente.");
  };

  return {
    inscripcionModalAbierta: abierto,
    horarioDestino,
    inscriptosActuales,
    socioSeleccionado: socioId,
    seleccionarSocio: setSocioId,
    fechaHastaVigencia: fechaHasta,
    seleccionarFechaHasta: setFechaHasta,
    guardandoInscripcion: guardando,
    errorInscripcion: error,
    abrirModalInscripcion: abrir,
    cerrarModalInscripcion: cerrar,
    guardarInscripcion: guardar,
  };
}
