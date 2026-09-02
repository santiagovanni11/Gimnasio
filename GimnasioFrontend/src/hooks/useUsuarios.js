// =========================================================
// HOOK DE GESTIÓN DE USUARIOS (FACHADA)
// Visible solo para Administrador.
// - Listado ordenado: Administrador -> Recepcionista -> Profesor.
// - Filtros: rol, e inactivos ocultos salvo verInactivos.
// - Composición: catálogo de roles, mutaciones de cuenta,
//   operaciones de acceso y auditoría.
// =========================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { usuariosService } from "../services/usuariosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { ordenarUsuariosPorRol } from "../constants/roles";
import { useRolesCatalogo } from "./useRolesCatalogo";
import { crearOperacionesUsuarios } from "./crearOperacionesUsuarios";
import { crearOperacionesAcceso } from "./crearOperacionesAcceso";
import { useAuditoriaUsuario } from "./useAuditoriaUsuario";
import { haySesion, obtenerUsuarioId } from "../services/almacenSesion";

const PERMISOS_USUARIOS = "No tenés permisos para ver los usuarios.";

export function useUsuarios(activo = true) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [verInactivos, setVerInactivos] = useState(false);
  const [filtroRol, setFiltroRol] = useState("");

  // Sesión actual: para impedir acciones sobre la propia cuenta
  const miUsuarioId = Number(obtenerUsuarioId());

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada: () => {} })
  );

  const catalogo = useRolesCatalogo();
  const auditoriaModulo = useAuditoriaUsuario();

  // ---------------------------------------------------------
  // CONSULTA
  // ---------------------------------------------------------

  const obtenerUsuarios = useCallback(async () => {
    setCargando(true);
    setError("");

    if (!haySesion()) {
      setError(PERMISOS_USUARIOS);
      return;
    }

    const resultado = await ejecutar({
      peticion: usuariosService.obtenerUsuarios,
      onError: setError,
      mensajePermiso: PERMISOS_USUARIOS,
      mensajeError: "No se pudieron cargar los usuarios.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al obtener usuarios:",
    });

    setCargando(false);

    if (!resultado) return;

    setUsuarios(
      Array.isArray(resultado.datos) ? resultado.datos : []
    );
  }, [ejecutar]);

  // Carga inicial cuando la sección se activa
  useEffect(() => {
    if (!activo) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga remota inicial
    obtenerUsuarios();
    catalogo.obtenerRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al activar la sección
  }, [activo]);

  /**
   * Listado visible: orden por rol + filtros de estado y rol.
   */
  const usuariosFiltrados = useMemo(
    () =>
      ordenarUsuariosPorRol(usuarios)
        .filter(
          (usuario) =>
            !filtroRol ||
            String(usuario.rolId) === String(filtroRol)
        )
        .filter((usuario) => verInactivos || usuario.activo !== false),
    [usuarios, filtroRol, verInactivos]
  );

  // ---------------------------------------------------------
  // MUTACIONES (fábricas por dominio)
  // ---------------------------------------------------------

  const operaciones = crearOperacionesUsuarios({
    ejecutar,
    setError,
    setMensaje,
    obtenerUsuarios,
    miUsuarioId,
    roles: catalogo.roles,
  });

  const acceso = crearOperacionesAcceso({
    ejecutar,
    setError,
    setMensaje,
    obtenerUsuarios,
  });

  return {
    usuarios,
    roles: catalogo.roles,
    miUsuarioId,
    cargando,
    error,
    mensaje,
    setMensaje,
    verInactivos,
    setVerInactivos,
    filtroRol,
    setFiltroRol,
    usuariosFiltrados,
    obtenerUsuarios,

    alternarEstado: operaciones.alternarEstado,
    cambiarRol: operaciones.cambiarRol,
    eliminarUsuario: operaciones.eliminarUsuario,

    resetearPassword: acceso.resetearPassword,
    desbloquear: acceso.desbloquear,

    auditoria: auditoriaModulo.auditoria,
    verAuditoria: auditoriaModulo.verAuditoria,
    cerrarAuditoria: auditoriaModulo.cerrarAuditoria,
  };
}
