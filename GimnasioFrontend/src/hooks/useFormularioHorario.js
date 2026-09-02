// =========================================================
// HOOK DE FORMULARIO DE HORARIO
// Alta/edición de franjas con profesor libre en esa franja
// (sin superponerse a otras clases del mismo día).
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { profesoresLibres } from "../utils/disponibilidadProfesores";

const CAMPOS_INICIALES = {
  empleadoId: "", diaSemana: "", horaInicio: "", horaFin: "",
};

export function useFormularioHorario({
  onSesionExpirada, obtenerTodo, notificar,
  horarios = [], profesores = [],
}) {
  const [abierto, setAbierto] = useState(false);
  const [claseDestino, setClaseDestino] = useState(null);
  const [horarioEditando, setHorarioEditando] = useState(null);
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const cambiarCampo = (campo, valor) =>
    setCampos((previo) => ({ ...previo, [campo]: valor }));

  /** Alta para una clase; edición conserva su clase/día base. */
  const abrirAlta = (clase) => {
    setCampos(CAMPOS_INICIALES);
    setClaseDestino(clase);
    setHorarioEditando(null);
    setError("");
    setAbierto(true);
  };

  const abrirEdicion = (horario) => {
    setCampos({
      empleadoId: String(horario.empleadoId ?? ""),
      diaSemana: String(horario.diaSemana ?? ""),
      horaInicio: String(horario.horaInicio ?? "").slice(0, 5),
      horaFin: String(horario.horaFin ?? "").slice(0, 5),
    });
    setClaseDestino(null);
    setHorarioEditando(horario);
    setError("");
    setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  /**
   * Profesores libres en la franja elegida. El horario en
   * edición no se autoexcluye.
   */
  const profesoresDisponibles = () =>
    profesoresLibres(profesores, horarios, campos,
      horarioEditando?.id ?? null);

  const validar = () => {
    if (!campos.diaSemana && campos.diaSemana !== 0) {
      return "Seleccioná el día de la semana.";
    }
    if (!campos.empleadoId) return "Seleccioná un profesor.";
    if (!campos.horaInicio || !campos.horaFin) {
      return "Completá la franja horaria.";
    }
    if (campos.horaFin <= campos.horaInicio) {
      return "La hora de fin debe ser posterior al inicio.";
    }
    return "";
  };

  const guardar = async (event) => {
    event.preventDefault();

    const validacion = validar();
    if (validacion) {
      setError(validacion);
      return;
    }

    setGuardando(true);
    setError("");

    const base = {
      claseId: Number(
        horarioEditando?.claseId ?? claseDestino?.id),
      empleadoId: Number(campos.empleadoId),
      diaSemana: Number(campos.diaSemana),
      horaInicio: campos.horaInicio,
      horaFin: campos.horaFin,
      activo: true,
    };

    const resultado = await ejecutar({
      peticion: horarioEditando
        ? () => clasesService.actualizarHorario(
            horarioEditando.id, base)
        : () => clasesService.crearHorario(base),
      onError: setError,
      mensajeError: horarioEditando
        ? "No se pudo actualizar el horario."
        : "No se pudo agregar el horario.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al guardar horario:",
    });

    setGuardando(false);

    if (!resultado) return;

    setAbierto(false);

    await obtenerTodo?.();
    notificar?.(horarioEditando
      ? "Horario actualizado correctamente."
      : "Horario agregado correctamente.");
  };

  return {
    horarioModalAbierto: abierto, claseDestino,
    horarioEditando, camposHorario: campos,
    guardandoHorario: guardando, errorHorario: error,
    profesoresDisponibles,
    abrirAltaHorario: abrirAlta, abrirEdicionHorario: abrirEdicion,
    cerrarModalHorario: cerrar, cambiarCampoHorario: cambiarCampo,
    guardarHorario: guardar,
  };
}
