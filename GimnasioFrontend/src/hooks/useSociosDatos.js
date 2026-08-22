// =========================================================
// HOOK DE DATOS DE SOCIOS
// Consulta, búsqueda y filtro de inactivos.
// =========================================================

import { useMemo, useState } from "react";
import { sociosService } from "../services/sociosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { normalizarTextoBusqueda } from "../utils/texto";

export function useSociosDatos({ onSesionExpirada }) {
  const [socios, setSocios] = useState([]);
  const [cargandoSocios, setCargandoSocios] = useState(false);
  const [errorSocios, setErrorSocios] = useState("");
  const [busquedaSocio, setBusquedaSocio] = useState("");
  const [verInactivos, setVerInactivos] = useState(false);

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const obtenerSocios = async () => {
    setCargandoSocios(true);
    setErrorSocios("");

    const resultado = await ejecutar({
      peticion: sociosService.obtenerSocios,
      onError: setErrorSocios,
      mensajePermiso:
        "No tenés permisos para consultar los socios.",
      mensajeError:
        (status) =>
          `Error al cargar los socios. Código HTTP: ${status}`,
      mensajeRed:
        "No se pudo conectar con la API para cargar los socios.",
      etiquetaLog: "Error al obtener socios:",
    });

    setCargandoSocios(false);

    if (!resultado) return;
    setSocios(Array.isArray(resultado.datos) ? resultado.datos : []);
  };

  /** Los inactivos solo se muestran con el filtro explícito. */
  const sociosFiltrados = useMemo(() => {
    return socios.filter((socio) => {
      if (!verInactivos && socio.activo === false) return false;

      const texto = normalizarTextoBusqueda(busquedaSocio);
      if (!texto) return true;

      const nombreCompleto = normalizarTextoBusqueda(
        `${socio.nombre ?? ""} ${socio.apellido ?? ""}`
      );

      return (
        nombreCompleto.includes(texto) ||
        normalizarTextoBusqueda(socio.dni ?? "").includes(texto) ||
        normalizarTextoBusqueda(socio.telefono ?? "").includes(texto)
      );
    });
  }, [socios, verInactivos, busquedaSocio]);

  const reiniciarDatos = () => {
    setSocios([]);
    setErrorSocios("");
    setBusquedaSocio("");
    setVerInactivos(false);
    setCargandoSocios(false);
  };

  return {
    socios,
    setSocios,
    cargandoSocios,
    errorSocios,
    setErrorSocios,
    busquedaSocio,
    setBusquedaSocio,
    verInactivos,
    setVerInactivos,
    sociosFiltrados,
    obtenerSocios,
    reiniciarDatos,
  };
}
