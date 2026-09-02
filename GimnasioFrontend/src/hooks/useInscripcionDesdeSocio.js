// =========================================================
// INSCRIPCIÓN A CLASES DESDE LA FICHA DEL SOCIO
// Muestra lo ya inscripto y permite agregar otro horario.
// La API revalida capacidad y duplicados.
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { diaSemanaTexto, franjaTexto } from "../utils/clases";
import {
  cupoDeHorario,
  ocupaCupo,
  ESTADO_INSCRIPCION,
} from "../utils/inscripcionesClase";

export function useInscripcionDesdeSocio({
  onSesionExpirada,
  notificar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [socio, setSocio] = useState(null);
  const [catalogo, setCatalogo] = useState(null);
  const [claseId, setClaseId] = useState("");
  const [horarioId, setHorarioId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  /** Trae el catálogo completo de clases, horarios e inscripciones. */
  const cargarCatalogo = async () => {
    setCargando(true);
    setError("");

    const pedir = (peticion, mensajeError, etiquetaLog) =>
      ejecutar({ peticion, onError: setError, mensajeError,
        mensajeRed: "No se pudo conectar con la API.", etiquetaLog });

    const [clases, horarios, inscripciones] = await Promise.all([
      pedir(clasesService.obtenerClases,
        "No se pudieron cargar las clases.", "Error al obtener clases:"),
      pedir(clasesService.obtenerHorarios,
        "No se pudieron cargar los horarios.", "Error al obtener horarios:"),
      pedir(clasesService.obtenerInscripciones,
        "No se pudieron cargar las inscripciones.", "Error al obtener inscripciones:"),
    ]);

    const lista = (respuesta) =>
      Array.isArray(respuesta?.datos) ? respuesta.datos : [];

    setCatalogo({
      clases: lista(clases).filter((c) => c.activa !== false),
      horarios: lista(horarios).filter((h) => h.activo !== false),
      inscripciones: lista(inscripciones),
    });
    setCargando(false);
  };

  /** Abre el modal y trae el catálogo completo. */
  const abrir = async (socioDestino) => {
    setSocio(socioDestino); setClaseId(""); setHorarioId("");
    setConfirmacion(""); setAbierto(true);

    if (socioDestino?.sinAccesoAClases) {
      setCargando(false);
      setCatalogo(null);
      setError(
        "El plan de este socio no incluye acceso a clases.");
      return;
    }

    setError("");
    await cargarCatalogo();
  };

  /** Franjas vigentes del socio en TODAS las clases. */
  const inscripcionesActuales = () =>
    !catalogo || !socio
      ? []
      : catalogo.inscripciones.filter(
          (i) =>
            Number(i.socioId) === Number(socio.id) &&
            i.estado !== ESTADO_INSCRIPCION.CANCELADA);

  const seleccionarClase = (id) => {
    setClaseId(id);
    setHorarioId("");
    setConfirmacion("");
  };

  const seleccionarHorario = (id) => {
    setHorarioId(id);
    setConfirmacion("");
  };

  /** Horarios de la clase elegida: cupo y si el socio ya está. */
  const horariosConCupo = () => {
    if (!catalogo || !claseId) return [];

    const clase = catalogo.clases.find(
      (c) => String(c.id) === String(claseId)
    );

    const yaInscripto = (horario) =>
      catalogo.inscripciones.some((i) =>
        Number(i.socioId) === Number(socio?.id) &&
        Number(i.horarioClaseId) === Number(horario.id) &&
        ocupaCupo(i));

    return catalogo.horarios
      .filter((h) => String(h.claseId) === String(claseId))
      .map((horario) => {
        const cupo = cupoDeHorario(
          catalogo.inscripciones, horario,
          clase?.capacidadMaxima ?? 0);

        return { ...horario,
          bloqueado: cupo.lleno || yaInscripto(horario),
          texto: `${diaSemanaTexto(horario.diaSemana)} ` +
            `${franjaTexto(horario.horaInicio, horario.horaFin)} hs` +
            ` · ${cupo.ocupados}/${cupo.capacidad}` +
            (yaInscripto(horario) ? " · YA INSCRIPTO" : "") +
            (cupo.lleno ? " · COMPLETO" : "") };
      });
  };

  const guardar = async () => {
    if (!socio || !horarioId) {
      setError("Seleccioná un horario.");
      return;
    }
    setGuardando(true);
    setError("");
    setConfirmacion("");

    const resultado = await ejecutar({
      peticion: () =>
        clasesService.inscribir({
          socioId: Number(socio.id),
          horarioClaseId: Number(horarioId),
        }),
      onError: setError,
      mensajePermiso: "No tenés permisos para gestionar inscripciones.",
      mensajeError: "No se pudo completar la inscripción.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al inscribir desde socios:",
    });

    setGuardando(false);

    if (!resultado) return;

    // Inscripción rápida: el modal queda abierto para anotar al mismo
    // socio en más clases. Se refresca el catálogo y se limpia la
    // selección para la siguiente inscripción.
    setConfirmacion("Socio inscripto correctamente.");
    setClaseId("");
    setHorarioId("");
    notificar?.("Socio inscripto a la clase correctamente.");
    await cargarCatalogo();
  };

  const cerrar = () => {
    setAbierto(false);
    setConfirmacion("");
  };

  return {
    inscripcionClaseAbierta: abierto, socioParaInscribir: socio,
    catalogoClases: catalogo, claseElegida: claseId,
    horarioElegido: horarioId, cargandoCatalogo: cargando,
    guardandoInscripcionClase: guardando,
    errorInscripcionClase: error,
    confirmacionInscripcionClase: confirmacion,
    horariosConCupo, inscripcionesActuales,
    abrirInscripcionClases: abrir, cerrarInscripcionClases: cerrar,
    seleccionarClaseDesdeSocio: seleccionarClase,
    seleccionarHorarioDesdeSocio: seleccionarHorario,
    guardarInscripcionDesdeSocio: guardar,
  };
}
