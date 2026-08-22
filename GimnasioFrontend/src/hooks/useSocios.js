// =========================================================
// HOOK DE SOCIOS (FACHADA)
// Compone datos + formulario + operaciones y expone el CRUD.
// Las bajas con confirmación usan el diálogo del sistema.
// =========================================================

import { useState } from "react";
import { sociosService } from "../services/sociosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { dialogoSistema } from "../services/servicioDialogos";
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

    formulario.setMensajeSocio(
      nuevoEstado
        ? "Socio reactivado correctamente."
        : "Socio desactivado correctamente."
    );
    await datos.obtenerSocios();
  };

  /** Elimina el socio; devuelve su id o null si no procedió. */
  const eliminarSocio = async (socio) => {
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Eliminar socio",
      mensaje:
        `¿BORRAR definitivamente al socio ${socio.nombre} ${socio.apellido}? ` +
        "Esta acción no se puede deshacer.",
      textoAceptar: "Eliminar definitivamente",
      tono: "peligro",
    });

    if (!aceptado) return null;
    datos.setErrorSocios("");

    const resultado = await ejecutar({
      peticion: () => sociosService.eliminarSocio(socio.id),
      onError: datos.setErrorSocios,
      mensajePermiso:
        "No tenés permisos para borrar socios. Solo un Administrador puede hacerlo.",
      mensajeError:
        (status) =>
          `No se pudo borrar el socio. Código HTTP: ${status}`,
      mensajeRed:
        "No se pudo conectar con la API para borrar el socio.",
      etiquetaLog: "Error al eliminar socio:",
    });

    return resultado ? socio.id : null;
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
    eliminarSocio,
    reiniciar,
  };
}
