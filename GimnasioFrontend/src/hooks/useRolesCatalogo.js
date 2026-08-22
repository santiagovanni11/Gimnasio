// =========================================================
// HOOK DE CATÁLOGO DE ROLES
// Listado de roles activos para los selects de gestión.
// =========================================================

import { useCallback, useState } from "react";
import { rolesService } from "../services/rolesService";

export function useRolesCatalogo() {
  const [roles, setRoles] = useState([]);

  const obtenerRoles = useCallback(async () => {
    try {
      const { respuesta, datos } =
        await rolesService.obtenerRoles();

      if (!respuesta.ok) return;

      setRoles(
        Array.isArray(datos)
          ? datos.filter((rol) => rol.activo !== false)
          : []
      );
    } catch (errorActual) {
      console.error("Error al obtener roles:", errorActual);
    }
  }, []);

  return { roles, obtenerRoles };
}
