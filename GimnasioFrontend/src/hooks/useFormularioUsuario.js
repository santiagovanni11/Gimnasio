// =========================================================
// FORMULARIO DE USUARIO (ALTA / EDICIÓN)
// Estado del modal de cuentas para Administrador. El alta
// define email + contraseña; la edición solo actualiza datos
// (la clave se cambia desde la fila con "Cambiar clave").
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { usuariosService } from "../services/usuariosService";
import {
  CAMPOS_INICIALES,
  camposEdicionUsuario,
  validarCamposUsuario,
} from "../utils/formularioUsuario";

export function useFormularioUsuario({ roles, obtenerUsuarios, notificar }) {
  const [abierto, setAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() => crearEjecutorApi({}));

  const cambiarCampo = (campo, valor) =>
    setCampos((previo) => ({ ...previo, [campo]: valor }));

  /** Alta: primer rol activo como default. */
  const abrirAlta = () => {
    setCampos({ ...CAMPOS_INICIALES, rolId: String(roles?.[0]?.id ?? "") });
    setUsuarioEditando(null);
    setError("");
    setAbierto(true);
  };

  /** Edición: solo datos; las credenciales no se tocan. */
  const abrirEdicion = (usuario) => {
    setCampos(camposEdicionUsuario(usuario));
    setUsuarioEditando(usuario);
    setError("");
    setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  const guardar = async (event) => {
    event.preventDefault();

    const validacion = validarCamposUsuario(campos, usuarioEditando);
    if (validacion) {
      setError(validacion);
      return;
    }

    setGuardando(true);
    setError("");

    const base = {
      email: campos.email.trim(),
      nombre: campos.nombre.trim(),
      apellido: campos.apellido.trim(),
      rolId: Number(campos.rolId),
    };

    const resultado = await ejecutar({
      peticion: usuarioEditando
        ? () =>
            usuariosService.actualizar(
              usuarioEditando.id,
              // Sin password: la edición no toca credenciales;
              // Activo se conserva (se gestiona por fila).
              { ...base, activo: usuarioEditando.activo }
            )
        : () =>
            usuariosService.crear({
              ...base,
              password: campos.password,
            }),
      onError: setError,
      mensajeError: usuarioEditando
        ? "No se pudo actualizar el usuario."
        : "No se pudo crear el usuario.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al guardar usuario:",
    });

    setGuardando(false);
    if (!resultado) return;

    setAbierto(false);
    await obtenerUsuarios?.();
    notificar?.(
      usuarioEditando
        ? "Usuario actualizado correctamente."
        : "Usuario creado correctamente."
    );
  };

  return {
    usuarioModalAbierto: abierto,
    usuarioEnEdicion: usuarioEditando,
    camposUsuario: campos,
    guardandoUsuario: guardando,
    errorUsuario: error,
    abrirAltaUsuario: abrirAlta,
    abrirEdicionUsuario: abrirEdicion,
    cerrarModalUsuario: cerrar,
    cambiarCampoUsuario: cambiarCampo,
    guardarUsuario: guardar,
  };
}
