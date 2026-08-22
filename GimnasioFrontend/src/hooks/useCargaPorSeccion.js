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

    if (
      ["inicio", "socios", "membresias", "pagos"].includes(seccion)
    ) {
      modulos.socios?.obtenerSocios?.();
    }

    if (["inicio", "membresias", "pagos"].includes(seccion)) {
      modulos.membresias?.obtenerMembresias?.();
    }

    if (["inicio", "pagos"].includes(seccion)) {
      modulos.pagos?.obtenerPagos?.();
    }

    // Planes: para Precios y también para el combo de
    // Membresías (alta/renovación necesitan la lista lista).
    if (["precios", "membresias"].includes(seccion)) {
      modulos.planes?.obtenerPlanes?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se ejecuta solo al cambiar de sección
  }, [logueado, seccion]);
}
