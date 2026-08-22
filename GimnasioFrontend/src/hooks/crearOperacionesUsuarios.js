// =========================================================
// OPERACIONES DE USUARIOS
// Fábrica con las mutaciones de la cuenta: estado (baja/alta
// lógica), cambio de rol y eliminación definitiva. Las
// confirmaciones usan el diálogo del sistema; las
// operaciones de acceso viven en crearOperacionesAcceso.
// =========================================================

import { usuariosService } from "../services/usuariosService";
import { dialogoSistema } from "../services/servicioDialogos";

export function crearOperacionesUsuarios({
  ejecutar,
  setError,
  setMensaje,
  obtenerUsuarios,
  miUsuarioId,
  roles,
}) {
  /** Baja/alta lógica del usuario. */
  const alternarEstado = async (usuario) => {
    const nuevoEstado = usuario.activo === false;

    // No permitir desactivar la propia cuenta
    if (!nuevoEstado && Number(usuario.id) === Number(miUsuarioId)) {
      setError("No podés desactivar tu propia cuenta.");
      return;
    }

    const accion = nuevoEstado ? "reactivar" : "desactivar";

    const aceptado = await dialogoSistema.confirmar({
      titulo: accion === "desactivar"
        ? "Desactivar usuario"
        : "Reactivar usuario",
      mensaje: `¿Seguro que querés ${accion} al usuario ${usuario.email}?`,
      textoAceptar: accion === "desactivar" ? "Desactivar" : "Reactivar",
    });

    if (!aceptado) return;

    setError("");
    setMensaje("");

    const resultado = await ejecutar({
      peticion: () =>
        usuariosService.cambiarEstado(usuario.id, nuevoEstado),
      onError: setError,
      mensajePermiso:
        "No tenés permisos para ver los usuarios.",
      mensajeError: `No se pudo ${accion} el usuario.`,
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar estado:",
    });

    if (!resultado) return;

    setMensaje(
      nuevoEstado
        ? "Usuario reactivado correctamente."
        : "Usuario desactivado correctamente."
    );
    await obtenerUsuarios();
  };

  /** Cambio de rol con confirmación. */
  const cambiarRol = async (usuario, nuevoRolId) => {
    const rolNuevo = roles.find(
      (rol) => Number(rol.id) === Number(nuevoRolId)
    );

    if (!rolNuevo || Number(rolNuevo.id) === Number(usuario.rolId)) {
      return;
    }

    const aceptado = await dialogoSistema.confirmar({
      titulo: "Cambiar rol",
      mensaje: `¿Cambiar el rol de ${usuario.email} a ${rolNuevo.nombre}?`,
      textoAceptar: "Cambiar rol",
      tono: "info",
    });

    if (!aceptado) {
      await obtenerUsuarios(); // revierte el select visualmente
      return;
    }

    setError("");
    setMensaje("");

    const resultado = await ejecutar({
      peticion: () =>
        usuariosService.cambiarRol(usuario.id, Number(nuevoRolId)),
      onError: setError,
      mensajePermiso: "No tenés permisos para ver los usuarios.",
      mensajeError: "No se pudo cambiar el rol.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar rol:",
    });

    if (!resultado) return;

    setMensaje("Rol actualizado correctamente.");
    await obtenerUsuarios();
  };

  /** Eliminación definitiva con confirmación explícita. */
  const eliminarUsuario = async (usuario) => {
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Eliminar usuario",
      mensaje:
        `¿ELIMINAR definitivamente la cuenta ${usuario.email}? ` +
        "Esta acción no se puede deshacer.",
      textoAceptar: "Eliminar definitivamente",
      tono: "peligro",
    });

    if (!aceptado) return;

    setError("");
    setMensaje("");

    const resultado = await ejecutar({
      peticion: () => usuariosService.eliminar(usuario.id),
      onError: setError,
      mensajePermiso: "No tenés permisos para ver los usuarios.",
      mensajeError: "No se pudo eliminar el usuario.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar usuario:",
    });

    if (!resultado) return;

    setMensaje(`Cuenta ${usuario.email} eliminada.`);
    await obtenerUsuarios();
  };

  return {
    alternarEstado,
    cambiarRol,
    eliminarUsuario,
  };
}
