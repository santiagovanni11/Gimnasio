// =========================================================
// HOOK DE DATOS DE MEMBRESÍAS
// Consulta, filtro por texto y utilidades de listado.
// =========================================================

import { useMemo, useState } from "react";
import { membresiasService } from "../services/membresiasService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { normalizarTextoBusqueda } from "../utils/texto";

export function useMembresiasDatos({
  onSesionExpirada,
  getSociosActivos,
}) {
  const [membresias, setMembresias] = useState([]);
  const [cargandoMembresias, setCargandoMembresias] = useState(false);
  const [errorMembresias, setErrorMembresias] = useState("");
  const [busquedaMembresia, setBusquedaMembresia] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  /**
   * Filtra por socios activos. Con `sociosOverride` usa esa
   * lista (útil justo después de eliminar un socio).
   */
  const filtrarPorSocios = (recibidas, sociosOverride) => {
    const base = sociosOverride ?? getSociosActivos?.() ?? [];

    const ids = new Set(
      base
        .filter((socio) => socio.activo !== false)
        .map((socio) => Number(socio.id))
        .filter((id) => Number.isFinite(id))
    );

    return recibidas.filter((m) => ids.has(Number(m.socioId)));
  };

  const obtenerMembresias = async (sociosOverride) => {
    setCargandoMembresias(true);
    setErrorMembresias("");

    const resultado = await ejecutar({
      peticion: membresiasService.obtenerMembresias,
      onError: setErrorMembresias,
      mensajePermiso: "No tenés permisos para consultar las membresías.",
      mensajeError:
        (status) =>
          `Error al cargar las membresías. Código HTTP: ${status}`,
      mensajeRed:
        "No se pudo conectar con la API para cargar las membresías.",
      etiquetaLog: "Error al obtener membresías:",
    });

    setCargandoMembresias(false);

    if (!resultado) return;

    const recibidas = Array.isArray(resultado.datos)
      ? resultado.datos
      : [];

    setMembresias(filtrarPorSocios(recibidas, sociosOverride));
  };

  /** Filtro de texto. El de rechazadas se aplica en useGymApp. */
  const membresiasFiltradas = useMemo(() => {
    return membresias.filter((membresia) => {
      const texto = normalizarTextoBusqueda(busquedaMembresia);
      if (!texto) return true;

      const nombreCompleto = normalizarTextoBusqueda(
        `${membresia.socioNombre ?? ""} ${membresia.socioApellido ?? ""}`
      );

      return (
        nombreCompleto.includes(texto) ||
        normalizarTextoBusqueda(membresia.socioNombre ?? "").includes(
          texto
        ) ||
        normalizarTextoBusqueda(membresia.socioApellido ?? "").includes(
          texto
        )
      );
    });
  }, [membresias, busquedaMembresia]);

  return {
    membresias,
    setMembresias,
    cargandoMembresias,
    errorMembresias,
    setErrorMembresias,
    busquedaMembresia,
    setBusquedaMembresia,
    membresiasFiltradas,
    obtenerMembresias,
  };
}
