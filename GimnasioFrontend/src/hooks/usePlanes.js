// =========================================================
// HOOK DE PLANES Y PRECIOS (FACHADA)
// Consulta de planes + wiring de la edición (que vive en
// useEdicionPrecios) y del historial (useHistorialPrecios).
// Reglas puras: utils/preciosConfig.
// =========================================================

import { useState } from "react";
import { planesService } from "../services/planesService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { precioSegunDuracion } from "../utils/planes";
import { useEdicionPrecios } from "./useEdicionPrecios";
import { useHistorialPrecios } from "./useHistorialPrecios";
import { crearOperacionesPlanes } from "./crearOperacionesPlanes";

export function usePlanes({ onSesionExpirada }) {
  const [planes, setPlanes] = useState([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);
  const [errorPlanes, setErrorPlanes] = useState("");

  const [preciosEditando, setPreciosEditando] = useState({});
  const [planEditando, setPlanEditando] = useState(null);
  const [guardandoPrecios, setGuardandoPrecios] = useState(false);
  const [mensajePrecios, setMensajePrecios] = useState("");
  const [errorPrecios, setErrorPrecios] = useState("");
  const [fechaRige, setFechaRige] = useState("");

  const [ejecutar] = useState(() => crearEjecutorApi({ onSesionExpirada }));

  const obtenerPlanes = async () => {
    setCargandoPlanes(true);
    setErrorPlanes("");

    const resultado = await ejecutar({
      peticion: planesService.obtenerPlanes,
      onError: setErrorPlanes,
      mensajePermiso: "No tenés permisos para consultar los planes.",
      mensajeError: (status) => `Error al cargar los planes. Código HTTP: ${status}`,
      mensajeRed: "No se pudo conectar con la API para cargar los planes.",
      etiquetaLog: "Error al obtener planes:",
    });

    setCargandoPlanes(false);
    if (!resultado) return;
    setPlanes(Array.isArray(resultado.datos) ? resultado.datos : []);
  };

  /** Precio del plan según duración (1/3/6/12 meses). */
  const obtenerPrecioSegunDuracion = precioSegunDuracion;

  const operaciones = crearOperacionesPlanes({
    ejecutar,
    setMensajePrecios,
    setErrorPrecios,
    obtenerPlanes,
  });

  const edicion = useEdicionPrecios({
    planes,
    preciosEditando,
    setPreciosEditando,
    setPlanEditando,
    setGuardandoPrecios,
    setMensajePrecios,
    setErrorPrecios,
    ejecutar,
    obtenerPlanes,
  });

  const historial = useHistorialPrecios();

  /** Reset total del dominio (al cerrar sesión). */
  const reiniciar = () => {
    setPlanes([]);
    setErrorPlanes("");
    setPreciosEditando({});
    setPlanEditando(null);
    setGuardandoPrecios(false);
    setMensajePrecios("");
    setErrorPrecios("");
    setFechaRige("");
    edicion.reiniciarOriginales();
  };

  return {
    planes,
    cargandoPlanes,
    errorPlanes,
    preciosEditando,
    setPreciosEditando,
    planEditando,
    setPlanEditando,
    guardandoPrecios,
    mensajePrecios,
    setMensajePrecios,
    errorPrecios,
    setErrorPrecios,
    obtenerPlanes,
    prepararPreciosEditando: edicion.prepararPreciosEditando,
    guardarPreciosPlan: (planId) => edicion.guardarPreciosPlan(planId, fechaRige || null),
    fechaRige,
    setFechaRige,
    validarCelda: edicion.validarCelda,
    alternarEstadoPlan: operaciones.alternarEstadoPlan,
    duplicarPlan: operaciones.duplicarPlan,
    eliminarPlan: operaciones.eliminarPlan,
    ...historial,
    obtenerPrecioSegunDuracion,
    reiniciar,
  };
}
