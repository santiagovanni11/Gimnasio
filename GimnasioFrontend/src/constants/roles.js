// =========================================================
// CONSTANTES DE ROLES
// Nombres, orden de presentación y permisos por rol.
// =========================================================

export const ROLES = {
  ADMINISTRADOR: "Administrador",
  RECEPCIONISTA: "Recepcionista",
  PROFESOR: "Profesor",
};

/**
 * Orden de presentación del listado de usuarios:
 * Administrador -> Recepcionista -> Profesor.
 */
export const ORDEN_ROLES = [
  ROLES.ADMINISTRADOR,
  ROLES.RECEPCIONISTA,
  ROLES.PROFESOR,
];

/** Prioridad numérica de un rol (menor = primero). */
export const prioridadDeRol = (nombreRol) => {
  const indice = ORDEN_ROLES.indexOf(nombreRol);
  return indice === -1 ? ORDEN_ROLES.length : indice;
};

/**
 * Ordena un listado de usuarios por rol y luego por email.
 * Tolerante a distintas formas de exponer el rol
 * (rolNombre plano o objeto anidado).
 */
export const ordenarUsuariosPorRol = (usuarios = []) =>
  [...usuarios].sort((a, b) => {
    const diferencia =
      prioridadDeRol(a.rolNombre ?? a.rol?.nombre) -
      prioridadDeRol(b.rolNombre ?? b.rol?.nombre);

    if (diferencia !== 0) return diferencia;

    return String(a.email ?? "").localeCompare(String(b.email ?? ""));
  });

const esAlguno = (rol, roles) => roles.includes(rol);

/** Mapa de permisos de la aplicación por nombre de permiso. */
export const calcularPermisos = (rol) => ({
  puedeVerSocios: esAlguno(rol, [
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
    ROLES.PROFESOR,
  ]),
  puedeCrearSocios: esAlguno(rol, [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]),
  puedeEditarSocios: esAlguno(rol, [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]),
  puedeEliminarSocios: rol === ROLES.ADMINISTRADOR,
  puedeVerMembresias: esAlguno(rol, [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]),
  puedeVerPagos: esAlguno(rol, [ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]),
  puedeVerClases: esAlguno(rol, [
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
    ROLES.PROFESOR,
  ]),
  puedeVerAsistencias: esAlguno(rol, [
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
    ROLES.PROFESOR,
  ]),
});
