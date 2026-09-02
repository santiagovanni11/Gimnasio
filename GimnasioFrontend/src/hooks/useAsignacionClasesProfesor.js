// =========================================================
// ASIGNACIÓN DE CLASES A UN PROFESOR (desde Usuarios).
// Solo franjas de clases activas bajo otro docente.
// =========================================================

import { useState } from "react";
import { dialogoSistema } from "../services/servicioDialogos";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { empleadosService } from "../services/empleadosService";
import {
  compararHorarios,
  diaSemanaTexto,
  franjaTexto,
} from "../utils/clases";

export function useAsignacionClasesProfesor({
  onSesionExpirada,
  notificar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [profesor, setProfesor] = useState(null);
  const [catalogo, setCatalogo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const pedir = (peticion, mensajeError, etiquetaLog) =>
    ejecutar({ peticion, onError: setError, mensajeError,
      mensajeRed: "No se pudo conectar con la API.", etiquetaLog });

  /** Abre el modal: legajo del profesor + clases + horarios. */
  const abrir = async (usuarioDestino) => {
    setProfesor(usuarioDestino); setError("");
    setCargando(true); setAbierto(true);

    // API vieja o caída → mostrar el error real.
    const profesoresRes = await pedir(
      empleadosService.obtenerProfesores,
      "No se pudieron cargar los profesores.",
      "Error al obtener profesores:");

    if (!profesoresRes) {
      setCargando(false);
      return;
    }

    const lista = (r) => (Array.isArray(r?.datos) ? r.datos : []);

    const legajo = lista(profesoresRes).find(
      (p) => Number(p.id) === Number(usuarioDestino.id)
    );

    const [clasesRes, horariosRes] = await Promise.all([
      pedir(clasesService.obtenerClases,
        "No se pudieron cargar las clases.", "Error al obtener clases:"),
      pedir(clasesService.obtenerHorarios,
        "No se pudieron cargar los horarios.", "Error al obtener horarios:"),
    ]);

    setCatalogo({
      legajoId: legajo?.empleadoId ?? null,
      clases: lista(clasesRes),
      horarios: lista(horariosRes),
    });

    setCargando(false);
  };
  const cerrar = () => setAbierto(false);

  /** Franjas que YA tiene este profesor. */
  const asignacionesActuales = () =>
    !catalogo?.legajoId ? [] : catalogo.horarios
      .filter((h) => Number(h.empleadoId) === Number(catalogo.legajoId))
      .sort(compararHorarios);

  /**
   * Franjas de clases activas bajo otro docente.
   */
  const disponiblesParaAsignar = () =>
    !catalogo?.legajoId ? [] : catalogo.horarios
      .filter((h) =>
        Number(h.empleadoId) !== Number(catalogo.legajoId) &&
        catalogo.clases.some(
          (c) => c.id === h.claseId && c.activa !== false))
      .sort(compararHorarios)
      .map((h) => ({
        ...h,
        descripcion: `${h.claseNombre} · ${diaSemanaTexto(h.diaSemana)} ` +
          `${franjaTexto(h.horaInicio, h.horaFin)} hs`,
        profesorActual: `${h.empleadoNombre} ${h.empleadoApellido}`.trim(),
      }));
  /** Pasa una franja existente a este profesor (PUT). */
  const asignar = async (horario) => {
    const acepta = await dialogoSistema.confirmar({
      titulo: "Asignar franja",
      mensaje:
        `"${horario.claseNombre}" ${diaSemanaTexto(horario.diaSemana)} ` +
        `${franjaTexto(horario.horaInicio, horario.horaFin)} hs pasa a ` +
        `${profesor?.nombre} ${profesor?.apellido}. ¿Continuar?`,
      textoAceptar: "Asignar",
    });

    if (!acepta) return;

    setGuardandoId(horario.id);

    const resultado = await ejecutar({
      peticion: () => clasesService.actualizarHorario(horario.id, {
        claseId: Number(horario.claseId),
        empleadoId: Number(catalogo.legajoId),
        diaSemana: Number(horario.diaSemana),
        horaInicio: String(horario.horaInicio),
        horaFin: String(horario.horaFin),
        activo: horario.activo,
      }),
      onError: setError,
      mensajePermiso: "Solo el Administrador puede asignar horarios.",
      mensajeError: "No se pudo asignar la franja.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al asignar franja:",
    });

    setGuardandoId(null);

    if (!resultado) return;

    notificar?.("Franja asignada correctamente.");

    const horarios = await pedir(clasesService.obtenerHorarios,
      "No se pudieron cargar los horarios.", "Error al obtener horarios:");

    setCatalogo((previo) => ({ ...previo,
      horarios: Array.isArray(horarios?.datos) ? horarios.datos : [] }));
  };

  return {
    asignacionAbierta: abierto, profesorDestino: profesor,
    catalogoAsignacion: catalogo,
    cargandoAsignacion: cargando, guardandoAsignacion: guardandoId,
    errorAsignacion: error,
    asignacionesActuales, disponiblesParaAsignar,
    abrirAsignacionClases: abrir, cerrarAsignacionClases: cerrar,
    asignarClaseAProfesor: asignar,
  };
}
