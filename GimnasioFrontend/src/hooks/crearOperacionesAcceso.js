// =========================================================
// OPERACIONES DE ACCESO DE USUARIOS
// Fábrica con las mutaciones de acceso: reset de contraseña
// de terceros (nunca la propia: eso vive en la Topbar) y
// desbloqueo de cuentas bloqueadas por intentos fallidos.
// =========================================================

import { usuariosService } from "../services/usuariosService";
import { dialogoSistema } from "../services/servicioDialogos";

export function crearOperacionesAcceso({
  ejecutar,
  setError,
  setMensaje,
  obtenerUsuarios,
}) {
  const opcionesBase = {
    onError: setError,
    mensajePermiso: "No tenés permisos sobre los usuarios.",
    mensajeRed: "No se pudo conectar con la API.",
  };

  /** Reset de contraseña con diálogo propio. */
  const resetearPassword = async (usuario) => {
    const nuevaPassword = await dialogoSistema.pedirTexto({
      titulo: "Cambiar clave",
      mensaje: `Nueva contraseña para ${usuario.email}`,
      placeholder: "Mínimo 6 caracteres",
      tipoCampo: "password",
      minimoCaracteres: 6,
      textoAceptar: "Guardar clave",
    });

    if (nuevaPassword === null) return;

    setError("");
    setMensaje("");

    const resultado = await ejecutar({
      ...opcionesBase,
      peticion: () =>
        usuariosService.resetearPassword(usuario.id, nuevaPassword),
      mensajeError: "No se pudo restablecer la contraseña.",
      etiquetaLog: "Error al resetear contraseña:",
    });

    if (!resultado) return;

    setMensaje("Contraseña actualizada correctamente.");
  };

  /** Limpia el bloqueo temporal de una cuenta. */
  const desbloquear = async (usuario) => {
    setError("");
    setMensaje("");

    const resultado = await ejecutar({
      ...opcionesBase,
      peticion: () => usuariosService.desbloquear(usuario.id),
      mensajeError: "No se pudo desbloquear la cuenta.",
      etiquetaLog: "Error al desbloquear:",
    });

    if (!resultado) return;

    setMensaje(`Cuenta ${usuario.email} desbloqueada.`);
    await obtenerUsuarios();
  };

  return { resetearPassword, desbloquear };
}
