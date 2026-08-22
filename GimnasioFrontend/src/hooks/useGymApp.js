// =========================================================
// useGymApp — ORQUESTADOR PRINCIPAL DE LA APLICACIÓN
// Compone los hooks de dominio, resuelve interacciones entre
// módulos y expone el contrato de las páginas. La lógica de
// cada dominio vive en su propio hook.
// =========================================================

import { useEffect, useState } from "react";
import { useSesion } from "./useSesion";
import { useSocios } from "./useSocios";
import { useMembresias } from "./useMembresias";
import { usePlanes } from "./usePlanes";
import { usePagos } from "./usePagos";
import { useCargaPorSeccion } from "./useCargaPorSeccion";
import { calcularPermisos } from "../constants/roles";
import { getMembresiasRechazadasIds } from "../utils/pagosPeriodo";
import { construirTicketPago } from "../utils/ticket";

export function useGymApp() {
  const sesion = useSesion();

  const [seccion, setSeccion] = useState("inicio");

  function cerrarSesion() {
    sesion.cerrarSesion();
    socios.reiniciar();
    membresias.reiniciar();
    planes.reiniciar();
    pagos.reiniciar();
    setSeccion("inicio");
    sesion.setMensaje("");
  }

  // ---------------------------------------------------------
  // MÓDULOS DE DOMINIO
  // ---------------------------------------------------------

  const socios = useSocios({    onSesionExpirada: cerrarSesion,
    alSocioCreado: manejarSocioCreado,
  });

  const membresias = useMembresias({
    onSesionExpirada: cerrarSesion,
    getSociosActivos: () => socios.socios,
    getPlanes: () => planes.planes,

    // Lazy: `planes` se declara más abajo (evita TDZ)
    obtenerPrecioSegunDuracion: (plan, duracion) =>
      planes.obtenerPrecioSegunDuracion(plan, duracion),

    irASeccion: cambiarSeccion,
    limpiarMensaje: () => sesion.setMensaje(""),
    notificar: (texto) => sesion.setMensaje(texto),
    alMembresiaCreada: manejarMembresiaCreada,
  });

  const planes = usePlanes({ onSesionExpirada: cerrarSesion });

  const pagos = usePagos({
    onSesionExpirada: cerrarSesion,
    notificar: (texto) => sesion.setMensaje(texto),
    construirTicket: (pago) =>
      construirTicketPago(
        pago,
        membresias.membresias,
        socios.socios
      ),
  });

  // Rechazadas del período + filtro transversal del listado
  const membresiasRechazadasIds = getMembresiasRechazadasIds(
    pagos.pagos,
    membresias.membresias
  );

  const membresiasFiltradas =
    membresias.membresiasFiltradas.filter(
      (m) => !membresiasRechazadasIds.has(Number(m.id))
    );

  function cambiarSeccion(nuevaSeccion) {
    setSeccion(nuevaSeccion);
    sesion.setMensaje("");
  }

  useCargaPorSeccion({
    logueado: sesion.logueado,
    seccion,
    modulos: { socios, membresias, pagos, planes },
  });

  useEffect(() => {
    if (
      sesion.logueado &&
      seccion === "precios" &&
      planes.planes.length > 0
    ) {
      planes.prepararPreciosEditando();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion.logueado, seccion, planes.planes]);

  // ---------------------------------------------------------
  // INTERACCIONES ENTRE MÓDULOS
  // ---------------------------------------------------------

  /** Socio creado -> invita a cargarle una membresía. */  function manejarSocioCreado(socioId) {
    membresias.abrirFormularioDesdeSocio(socioId);
    sesion.setMensaje(
      "Socio creado. Ahora agregá la membresía correspondiente."
    );
  }

  /** Membresía creada -> precarga el cobro en Pagos. */
  function manejarMembresiaCreada(membresiaId, precioAplicado) {
    setSeccion("pagos");
    pagos.prefillPago(membresiaId, precioAplicado);
  }

  /** Socio eliminado -> sincroniza membresías y refresca. */
  async function eliminarSocio(socio) {
    const idEliminado = await socios.eliminarSocio(socio);
    if (idEliminado == null) return;

    const restantes = socios.socios.filter(
      (item) => Number(item.id) !== Number(socio.id)
    );

    await membresias.sincronizarSocioEliminado(socio.id, restantes);
    await socios.obtenerSocios();
  }

  return {
    ...sesion,
    cerrarSesion,
    ...socios,
    ...planes,
    ...pagos,
    ...membresias,

    membresiasFiltradas,
    membresiasRechazadasIds,

    seccion,
    setSeccion,
    cambiarSeccion,
    eliminarSocio,
    ...calcularPermisos(sesion.rol),
  };
}
