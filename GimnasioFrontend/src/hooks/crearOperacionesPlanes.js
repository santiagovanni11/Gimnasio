// =========================================================
// OPERACIONES DE PLANES
// Fábrica: pausar/reactivar la venta, duplicar y eliminar.
// Recibe ejecutor y callbacks; no posee estado propio.
// =========================================================

import { planesService } from "../services/planesService";
import { dialogoSistema } from "../services/servicioDialogos";

export function crearOperacionesPlanes({
  ejecutar,
  setMensajePrecios,
  setErrorPrecios,
  obtenerPlanes,
}) {
  /** Pausa/reactiva la venta de un plan (no se borra). */
  const alternarEstadoPlan = async (plan) => {
    const nuevoEstado = plan.activo === false;
    const accion = nuevoEstado ? "reactivar" : "pausar";

    const aceptado = await dialogoSistema.confirmar({
      titulo: accion === "pausar" ? "Pausar plan" : "Reactivar plan",
      mensaje: `¿Seguro que querés ${accion} el plan ${plan.nombre}?`,
      textoAceptar: accion === "pausar" ? "Pausar" : "Reactivar",
    });

    if (!aceptado) return;

    setMensajePrecios("");
    setErrorPrecios("");

    const resultado = await ejecutar({
      peticion: () =>
        planesService.cambiarEstado(plan.id, nuevoEstado),
      onError: setErrorPrecios,
      mensajePermiso:
        "No tenés permisos para modificar los planes.",
      mensajeError: `No se pudo ${accion} el plan.`,
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar estado del plan:",
    });

    if (!resultado) return;

    setMensajePrecios(
      nuevoEstado
        ? "Plan reactivado correctamente."
        : "Plan pausado: deja de venderse pero conserva su historial."
    );
    await obtenerPlanes();
  };

  /** Crea una copia del plan usando el POST existente. */
  const duplicarPlan = async (plan) => {
    const nombre = await dialogoSistema.pedirTexto({
      titulo: "Duplicar plan",
      mensaje: "Nombre de la copia:",
      valorInicial: `${plan.nombre} (copia)`,
      minimoCaracteres: 1,
      textoAceptar: "Duplicar",
    });

    if (nombre === null) return;

    setMensajePrecios("");
    setErrorPrecios("");

    const resultado = await ejecutar({
      peticion: () =>
        planesService.crearPlan({
          nombre: nombre.trim(),
          descripcion: plan.descripcion ?? "",
          precio: plan.precio,
          precio1Mes: plan.precio1Mes,
          precio3Meses: plan.precio3Meses,
          precio6Meses: plan.precio6Meses,
          precio12Meses: plan.precio12Meses,
          tipo: plan.tipo ?? "",
        }),
      onError: setErrorPrecios,
      mensajePermiso: "No tenés permisos para crear planes.",
      mensajeError: "No se pudo duplicar el plan.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al duplicar plan:",
    });

    if (!resultado) return;

    setMensajePrecios("Plan duplicado correctamente.");
    await obtenerPlanes();
  };

  /** Eliminación definitiva con confirmación explícita. */
  const eliminarPlan = async (plan) => {
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Eliminar plan",
      mensaje:
        `¿ELIMINAR definitivamente el plan "${plan.nombre}"? ` +
        "Solo es posible si no tiene membresías asociadas.",
      textoAceptar: "Eliminar definitivamente",
      tono: "peligro",
    });

    if (!aceptado) return;

    setMensajePrecios("");
    setErrorPrecios("");

    const resultado = await ejecutar({
      peticion: () => planesService.eliminarPlan(plan.id),
      onError: setErrorPrecios,
      mensajePermiso: "No tenés permisos sobre los planes.",
      mensajeError:
        "No se pudo eliminar el plan (¿tiene membresías asociadas?).",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar plan:",
    });

    if (!resultado) return;

    setMensajePrecios(`Plan "${plan.nombre}" eliminado.`);
    await obtenerPlanes();
  };

  return { alternarEstadoPlan, duplicarPlan, eliminarPlan };
}
