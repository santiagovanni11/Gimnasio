// =========================================================
// CARGA DE DATOS POR SECCIÓN
// Efecto central del dashboard: define qué módulos se
// refrescan al entrar en cada sección del panel.
// =========================================================

import { useEffect } from "react";

/**
 * @param {object} p - { logueado, seccion, modulos }
 * donde modulos = { socios, membresias, pagos, planes },
 * cada uno exponiendo su `obtener...()`.
 */
export function useCargaPorSeccion({ logueado, seccion, modulos }) {
  useEffect(() => {
    if (!logueado) return;

    // Socios, membresías y pagos se cargan juntos: las
    // insignias de estado en Socios y el filtro de rechazadas
    // del listado de Membresías cruzan los tres datos.
    if (
      ["inicio", "socios", "membresias", "pagos"].includes(seccion)
    ) {
      modulos.socios?.obtenerSocios?.();
      modulos.membresias?.obtenerMembresias?.();
      modulos.pagos?.obtenerPagos?.();
    }

    // Planes: para Precios y también para el combo de
    // Membresías (alta/renovación necesitan la lista lista).
    if (["precios", "membresias"].includes(seccion)) {
      modulos.planes?.obtenerPlanes?.();
    }

    // Socios para el selector de inscripciones de Clases.
    if (seccion === "clases") {
      modulos.socios?.obtenerSocios?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se ejecuta solo al cambiar de sección
  }, [logueado, seccion]);
}
