// =========================================================
// HOOK AUDITORÍA DE USUARIO
// Carga el historial de una cuenta para su modal. Compuesto
// por useUsuarios junto al catálogo de roles.
// =========================================================

import { useState } from "react";
import { usuariosService } from "../services/usuariosService";
import { mensajeDeError } from "../services/apiClient";

const auditoriaVacia = {
  usuario: null,
  registros: [],
  cargando: false,
};

export function useAuditoriaUsuario() {
  const [auditoria, setAuditoria] = useState(auditoriaVacia);

  const cerrarAuditoria = () => setAuditoria(auditoriaVacia);

  const verAuditoria = async (usuario) => {
    setAuditoria({ usuario, registros: [], cargando: true });

    try {
      const { respuesta, datos } =
        await usuariosService.obtenerAuditoria(usuario.id);

      if (!respuesta.ok) {
        throw new Error(
          mensajeDeError(
            datos,
            `Error HTTP ${respuesta.status}`
          )
        );
      }

      setAuditoria({
        usuario,
        registros: Array.isArray(datos) ? datos : [],
        cargando: false,
      });
    } catch (error) {
      console.error("Error al obtener auditoría:", error);
      setAuditoria({ ...auditoriaVacia });
    }
  };

  return { auditoria, verAuditoria, cerrarAuditoria };
}
