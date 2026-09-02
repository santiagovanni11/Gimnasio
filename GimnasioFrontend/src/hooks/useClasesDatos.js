// =========================================================
// DATOS DEL DOMINIO CLASES
// Carga del catálogo de clases, horarios, inscripciones,
// asistencias y profesores. Un solo refresco para mantener
// las secciones de Clases y Asistencias consistentes.
// =========================================================

import { useCallback, useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { empleadosService } from "../services/empleadosService";

export function useClasesDatos({ onSesionExpirada }) {
  const [clases, setClases] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const cargarLista = useCallback(
    async (peticion, mensajeError, etiquetaLog) => {
      const resultado = await ejecutar({
        peticion,
        onError: setError,
        mensajeError,
        mensajeRed: "No se pudo conectar con la API.",
        etiquetaLog,
      });

      return Array.isArray(resultado?.datos)
        ? resultado.datos
        : [];
    },
    [ejecutar]
  );

  /** Carga todo el dominio en paralelo. */
  const obtenerTodo = useCallback(async () => {
    setCargando(true);
    setError("");

    const [clasesNuevas, horariosNuevos,
      inscripcionesNuevas, profesoresNuevos,
      asistenciasNuevas] = await Promise.all([
      cargarLista(clasesService.obtenerClases,
        "No se pudieron cargar las clases.",
        "Error al obtener clases:"),
      cargarLista(clasesService.obtenerHorarios,
        "No se pudieron cargar los horarios.",
        "Error al obtener horarios:"),
      cargarLista(clasesService.obtenerInscripciones,
        "No se pudieron cargar las inscripciones.",
        "Error al obtener inscripciones:"),
      cargarLista(empleadosService.obtenerProfesores,
        "No se pudieron cargar los profesores.",
        "Error al obtener profesores:"),
      cargarLista(clasesService.obtenerAsistencias,
        "No se pudieron cargar las asistencias.",
        "Error al obtener asistencias:"),
    ]);

    const profesoresActivos = (Array.isArray(profesoresNuevos)
      ? profesoresNuevos.filter((profesor) => profesor?.activo !== false)
      : []);

    setClases(clasesNuevas);
    setHorarios(horariosNuevos);
    setInscripciones(inscripcionesNuevas);
    setProfesores(profesoresActivos);
    setAsistencias(asistenciasNuevas);
    setCargando(false);
  }, [cargarLista]);

  /** Refresco liviano solo del listado de asistencias. */
  const obtenerAsistencias = useCallback(async () => {
    setAsistencias(
      await cargarLista(
        clasesService.obtenerAsistencias,
        "No se pudieron cargar las asistencias.",
        "Error al obtener asistencias:"
      )
    );
  }, [cargarLista]);

  const reiniciar = () => {
    setClases([]);
    setHorarios([]);
    setInscripciones([]);
    setAsistencias([]);
    setProfesores([]);
    setError("");
  };

  return {
    clases,
    horarios,
    inscripciones,
    asistencias,
    profesores,
    cargando,
    error,
    setError,
    obtenerTodo,
    obtenerAsistencias,
    reiniciar,
  };
}
