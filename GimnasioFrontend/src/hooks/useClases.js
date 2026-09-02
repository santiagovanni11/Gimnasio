// =========================================================
// HOOK DE CLASES (FACHADA)
// Compone datos + formulario de clase + formulario de
// horario + bajas, y expone el contrato de la sección.
// Sin lógica propia. Carga inicial al activarse la sección.
// =========================================================

import { useEffect, useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { useClasesDatos } from "./useClasesDatos";
import { useFormularioClase } from "./useFormularioClase";
import { useFormularioHorario } from "./useFormularioHorario";
import { useFormularioInscripcion } from "./useFormularioInscripcion";
import { useFormularioInscripcionMasiva } from "./useFormularioInscripcionMasiva";
import { crearBajasClases } from "./crearBajasClases";

export function useClases({ activo = true, onSesionExpirada }) {
  const [mensaje, setMensaje] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const datos = useClasesDatos({ onSesionExpirada });

  const notificar = (texto) => setMensaje(texto);
  const avisarError = (texto) => datos.setError(texto);

  const formularioClase = useFormularioClase({
    onSesionExpirada,
    obtenerTodo: datos.obtenerTodo,
    notificar,
    horarios: datos.horarios,
    profesores: datos.profesores,
  });

  const formularioHorario = useFormularioHorario({
    onSesionExpirada,
    obtenerTodo: datos.obtenerTodo,
    notificar,
    horarios: datos.horarios,
    profesores: datos.profesores,
  });

  const formularioInscripcion = useFormularioInscripcion({
    onSesionExpirada,
    obtenerTodo: datos.obtenerTodo,
    notificar,
  });

  const formularioInscripcionMasiva =
    useFormularioInscripcionMasiva({
      onSesionExpirada,
      obtenerTodo: datos.obtenerTodo,
      notificar,
    });

  const bajas = crearBajasClases({
    ejecutar,
    notificar,
    avisarError,
    obtenerTodo: datos.obtenerTodo,
  });

  const { obtenerTodo } = datos;

  useEffect(() => {
    if (!activo) return;

    obtenerTodo();
  }, [activo, obtenerTodo]);

  return {
    ...datos,
    mensaje,
    setMensaje,

    ...formularioClase,
    ...formularioHorario,
    ...formularioInscripcion,
    ...formularioInscripcionMasiva,

    eliminarClase: bajas.eliminarClase,
    alternarEstadoClase: bajas.alternarEstadoClase,
    eliminarHorario: bajas.eliminarHorario,
    cancelarInscripcion: bajas.cancelarInscripcion,
  };
}
