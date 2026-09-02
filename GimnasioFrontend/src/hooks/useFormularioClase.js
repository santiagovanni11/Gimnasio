// =========================================================
// FORMULARIO DE CLASE (ALTA / EDICIÓN)
// Alta con primer horario opcional; edición solo datos.
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { profesoresLibres } from "../utils/disponibilidadProfesores";
import {
  hayInicioHorario,
  validarFranja,
  crearPrimerHorario,
} from "./crearPrimerHorario";

const CAMPOS_INICIALES = {
  nombre: "", descripcion: "",
  duracionMinutos: "", capacidadMaxima: "",
  empleadoId: "", diaSemana: "", horaInicio: "", horaFin: "",
};
export function useFormularioClase({
  onSesionExpirada, obtenerTodo, notificar,
  horarios = [], profesores = [],
}) {
  const [abierto, setAbierto] = useState(false);
  const [claseEditando, setClaseEditando] = useState(null);
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const cambiarCampo = (campo, valor) =>
    setCampos((previo) => ({ ...previo, [campo]: valor }));

  const abrirAlta = () => {
    setCampos(CAMPOS_INICIALES);
    setClaseEditando(null);
    setError(""); setAbierto(true);
  };

  /** Edición toca solo datos; horarios se gestionan aparte. */
  const abrirEdicion = (clase) => {
    setCampos({
      nombre: clase.nombre ?? "",
      descripcion: clase.descripcion ?? "",
      duracionMinutos: String(clase.duracionMinutos ?? ""),
      capacidadMaxima: String(clase.capacidadMaxima ?? ""),
      empleadoId: "", diaSemana: "",
      horaInicio: "", horaFin: "",
    });
    setClaseEditando(clase);
    setError(""); setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  /** Profesores libres para la franja opcional elegida. */
  const profesoresDisponibles = () =>
    profesoresLibres(profesores, horarios, campos);

  const validar = () => {
    if (!campos.nombre.trim()) return "El nombre es obligatorio.";
    if (!(Number(campos.duracionMinutos) > 0))
      return "La duración debe ser mayor a 0 minutos.";
    if (!(Number(campos.capacidadMaxima) > 0))
      return "La capacidad máxima debe ser mayor a 0.";
    if (hayInicioHorario(campos)) return validarFranja(campos);
    return "";
  };

  const guardar = async (event) => {
    event.preventDefault();
    const validacion = validar();
    if (validacion) { setError(validacion); return; }

    const profesorOcupado =
      hayInicioHorario(campos) && profesores.length > 0 &&
      !profesoresDisponibles().some(
        (p) => String(p.empleadoId) === String(campos.empleadoId));

    if (profesorOcupado) {
      setError(
        "El profesor ya está asignado a otra clase en ese día y horario: " +
        "cambiá la franja o el profesor.");
      return;
    }

    setGuardando(true);
    setError("");

    const base = {
      nombre: campos.nombre.trim(),
      descripcion: campos.descripcion.trim(),
      duracionMinutos: Number(campos.duracionMinutos),
      capacidadMaxima: Number(campos.capacidadMaxima),
    };

    const resultado = await ejecutar({
      peticion: claseEditando
        ? () => clasesService.actualizarClase(
            claseEditando.id, base)
        : () => clasesService.crearClase(base),
      onError: setError,
      mensajePermiso: "No tenés permisos para gestionar clases.",
      mensajeError: claseEditando
        ? "No se pudo actualizar la clase."
        : "No se pudo crear la clase.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al guardar clase:",
    });

    if (!resultado) { setGuardando(false); return; }

    const horarioResultado =
      !claseEditando && hayInicioHorario(campos)
        ? await crearPrimerHorario({
            ejecutar, claseId: resultado.datos.id, campos })
        : { ok: true };

    setGuardando(false);

    if (!horarioResultado.ok) {
      setError(horarioResultado.error
        ? "La clase se creó, pero el horario no se asignó: " +
          `${horarioResultado.error}.`
        : "La clase se creó, pero el horario no se asignó.");
      await obtenerTodo?.();
      return;
    }

    setAbierto(false);
    await obtenerTodo?.();

    notificar?.(claseEditando
      ? "Clase actualizada correctamente."
      : `Clase "${base.nombre}" creada correctamente.`);
  };

  return {
    claseModalAbierto: abierto, claseEditando,
    camposClase: campos, guardandoClase: guardando,
    errorClase: error, profesoresDisponibles,
    abrirAltaClase: abrirAlta, abrirEdicionClase: abrirEdicion,
    cerrarModalClase: cerrar, cambiarCampoClase: cambiarCampo,
    guardarClase: guardar,
  };
}