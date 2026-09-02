// =========================================================
// HOOK DE SOCIOS (FACHADA)
// Compone datos + formulario + operaciones y expone el CRUD.
// Las bajas con confirmación usan el diálogo del sistema.
// =========================================================

import { useState } from "react";
import { sociosService } from "../services/sociosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { dialogoSistema } from "../services/servicioDialogos";
import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { registrarCambioSocio } from "../utils/sociosMetadata";
import { useSociosFormulario } from "./useSociosFormulario";
import { useSociosDatos } from "./useSociosDatos";
import { crearOperacionesSocios } from "./crearOperacionesSocios";

export function useSocios(opciones) {
  const { onSesionExpirada, alSocioCreado } = opciones || {};

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const formulario = useSociosFormulario();
  const datos = useSociosDatos({ onSesionExpirada });

  const operaciones = crearOperacionesSocios({
    formulario,
    datos,
    ejecutar,
    alSocioCreado,
  });

  /** Baja/alta lógica: preserva el historial del socio. */
  const alternarEstadoSocio = async (socio) => {
    const nuevoEstado = socio.activo === false;
    const accion = nuevoEstado ? "reactivar" : "desactivar";
    const nombreCompleto = `${socio.nombre || ""} ${socio.apellido || ""}`.trim();
    const autor = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";

    const aceptado = await dialogoSistema.confirmar({
      titulo:
        accion === "desactivar"
          ? "Desactivar socio"
          : "Reactivar socio",
      mensaje: `¿Seguro que querés ${accion} a ${socio.nombre} ${socio.apellido}?`,
      textoAceptar: accion === "desactivar" ? "Desactivar" : "Reactivar",
    });

    if (!aceptado) return;

    datos.setErrorSocios("");

    const resultado = await ejecutar({
      peticion: () =>
        sociosService.alternarEstado(socio, nuevoEstado),
      onError: datos.setErrorSocios,
      mensajePermiso: "No tenés permisos para modificar socios.",
      mensajeError: `No se pudo ${accion} el socio.`,
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar estado del socio:",
    });

    if (!resultado) return;

    registrarCambioSocio(
      Number(socio.id),
      nuevoEstado ? "Reactivación" : "Desactivación",
      nombreCompleto || `socio ${socio.id}`,
      autor
    );

    formulario.setMensajeSocio(
      nuevoEstado
        ? "Socio reactivado correctamente."
        : "Socio desactivado correctamente."
    );
    await datos.obtenerSocios();
  };

  const reiniciar = () => {
    datos.reiniciarDatos();
    formulario.reiniciarFormularioSocio();
  };

  return {
    ...formulario,
    ...datos,
    crearSocio: operaciones.crearSocio,
    actualizarSocio: operaciones.actualizarSocio,
    alternarEstadoSocio,
    reiniciar,
  };
}
