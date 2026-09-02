// =========================================================
// ESTADOS MANUALES DE MEMBRESÍAS
// Suspensión y reactivación. La suspensión actualiza el
// listado en local (estado determinístico); la reactivación
// refresca desde la API porque el estado final depende del
// recálculo por fechas.
// =========================================================

import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { membresiasService } from "../services/membresiasService";
import { dialogoSistema } from "../services/servicioDialogos";
import { registrarEventoMembresia } from "../utils/membresiasMetadata";

const ESTADO_SUSPENDIDA = 4;

export function crearEstadosMembresias({
  datos,
  ejecutar,
  notificar,
}) {
  const suspenderMembresia = async (membresia) => {
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Suspender membresía",
      mensaje: `¿Suspender la membresía de ${membresia.socioNombre} ${membresia.socioApellido}?`,
      textoAceptar: "Suspender",
    });

    if (!aceptado) return;

    const resultado = await ejecutar({
      peticion: () =>
        membresiasService.suspenderMembresia(membresia.id),
      onError: datos.setErrorMembresias,
      mensajePermiso: "No tenés permisos para modificar membresías.",
      mensajeError: "No se pudo suspender la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al suspender membresía:",
    });

    if (!resultado) return;

    registrarEventoMembresia(
      Number(membresia.id),
      "Suspensión de membresía",
      `Estado actualizado a suspendida · ${membresia.fechaFin || "-"}`,
      usuario
    );

    datos.setMembresias((previo) =>
      previo.map((item) =>
        Number(item.id) === Number(membresia.id)
          ? { ...item, estado: ESTADO_SUSPENDIDA }
          : item
      )
    );

    notificar("Membresía suspendida correctamente.");
  };

  const reactivarMembresia = async (membresia) => {
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";
    const resultado = await ejecutar({
      peticion: () =>
        membresiasService.reactivarMembresia(membresia.id),
      onError: datos.setErrorMembresias,
      mensajePermiso: "No tenés permisos para modificar membresías.",
      mensajeError: "No se pudo reactivar la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al reactivar membresía:",
    });

    if (!resultado) return;

    registrarEventoMembresia(
      Number(membresia.id),
      "Reactivación de membresía",
      `Se reactivó la membresía del socio ${membresia.socioNombre} ${membresia.socioApellido}`,
      usuario
    );

    // El estado final lo define el backend según fechas.
    await datos.obtenerMembresias();
    notificar("Membresía reactivada correctamente.");
  };

  return { suspenderMembresia, reactivarMembresia };
}
