// =========================================================
// DIÁLOGO DEL SISTEMA (servicio)
// Reemplaza los diálogos nativos del navegador por modales
// propios. Patrón: promesa + un único host montado
// en la app que escucha las solicitudes.
//
// Uso desde cualquier hook o fábrica (sin React):
//   const ok = await dialogoSistema.confirmar({
//     titulo: "Eliminar",
//     mensaje: "¿Continuar?",
//     textoAceptar: "Eliminar",
//   });
//   if (!ok) return;
//
//   const clave = await dialogoSistema.pedirTexto({
//     titulo: "Cambiar clave",
//     tipoCampo: "password",
//     minimoCaracteres: 6,
//   });
//   if (clave === null) return; // cancelado
// =========================================================

let manejador = null;

/**
 * Emite la solicitud al host montado. Sin host (no debería
 * pasar), resuelve con el valor seguro por defecto para no
 * bloquear flujos.
 */
const solicitar = (opciones) =>
  new Promise((resolve) => {
    if (!manejador) {
      resolve(opciones.tipo === "texto" ? null : false);
      return;
    }

    manejador({ ...opciones, resolver: resolve });
  });

export const dialogoSistema = {
  /** Confirmación sí/no: resuelve true/false. */
  confirmar(opciones = {}) {
    return solicitar({
      tipo: "confirm",
      textoAceptar: "Aceptar",
      textoCancelar: "Cancelar",
      tono: "info",
      ...opciones,
    });
  },

  /**
   * Texto libre (reemplaza prompt): resuelve string o null si
   * se canceló. Con minimoCaracteres, el host valida antes de
   * aceptar.
   */
  pedirTexto(opciones = {}) {
    return solicitar({
      tipo: "texto",
      textoAceptar: "Guardar",
      ...opciones,
    });
  },
};

/** Registra el host visual (retorna desuscripción). */
export function registrarManejadorDialogos(manejadorNuevo) {
  manejador = manejadorNuevo;

  return () => {
    if (manejador === manejadorNuevo) {
      manejador = null;
    }
  };
}
