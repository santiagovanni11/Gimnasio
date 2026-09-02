// =========================================================
// AVISO DE CAMBIOS DE PRECIO PROGRAMADOS
// Banner autocontenido: consulta los pendientes de todos los
// planes, avisa antes de que rija la suba y permite anular
// cada cambio (el plan conserva sus precios actuales).
// =========================================================

import { useEffect, useState } from "react";
import { planesService } from "../../services/planesService";
import { mensajeDeError } from "../../services/apiClient";
import { dialogoSistema } from "../../services/servicioDialogos";
import {
  fechaDesdeUtc,
  fechaTexto,
} from "../../utils/fechas";

/** Consulta los pendientes; null si falla (informativo). */
const consultarPendientes = async () => {
  try {
    const { respuesta, datos } =
      await planesService.cambiosPendientes();

    if (!respuesta.ok) {
      throw new Error(
        mensajeDeError(datos, `HTTP ${respuesta.status}`)
      );
    }

    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al consultar cambios pendientes:", error);
    return null;
  }
};

/**
 * Aviso global del módulo precios. No renderiza nada si no
 * hay cambios futuros programados.
 * @param {Function} notificar Aviso de éxito de la sección.
 * @param {Function} avisarError Error de la sección.
 */
export default function AvisoCambiosProgramados({
  notificar,
  avisarError,
}) {
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [anulandoId, setAnulandoId] = useState(null);

  useEffect(() => {
    let vigente = true;

    (async () => {
      const lista = await consultarPendientes();

      if (!vigente) return;

      if (lista) setPendientes(lista);
      setCargando(false);
    })();

    return () => {
      vigente = false;
    };
  }, []);

  /** Anula un cambio programado tras confirmación. */
  const anular = async (cambio) => {
    const acepta = await dialogoSistema.confirmar({
      titulo: "Anular cambio programado",
      mensaje:
        `${cambio.planNombre} va a mantener sus precios ` +
        `actuales. ¿Anular el cambio programado?`,
      textoAceptar: "Anular",
      textoCancelar: "Conservar",
      tono: "peligro",
    });

    if (!acepta) return;

    setAnulandoId(cambio.id);

    try {
      const { respuesta, datos } =
        await planesService.anularCambioPendiente(cambio.id);

      if (!respuesta.ok) {
        throw new Error(
          mensajeDeError(datos, `HTTP ${respuesta.status}`)
        );
      }

      setPendientes((prev) =>
        prev.filter((p) => p.id !== cambio.id)
      );
      notificar?.("Cambio de precio programado anulado.");
    } catch (error) {
      console.error("Error al anular cambio programado:", error);
      avisarError?.("No se pudo anular el cambio programado.");
    } finally {
      setAnulandoId(null);
    }
  };

  if (cargando || !pendientes.length) return null;

  return (
    <div className="success-message aviso-programados">
      <strong>Cambios de precio programados</strong>

      <ul>
        {pendientes.map((cambio) => (
          <li key={cambio.id}>
            <span>
              <strong>{cambio.planNombre}</strong> rige el{" "}
              <strong>
                {fechaTexto(fechaDesdeUtc(cambio.vigenteDesde)) ||
                  "-"}
              </strong>{" "}
              (programado)
            </span>

            <button
              type="button"
              className="delete-button aviso-programados-anular"
              disabled={anulandoId === cambio.id}
              onClick={() => anular(cambio)}
              title="Deja los precios del plan como están hoy"
            >
              {anulandoId === cambio.id ? "Anulando…" : "Anular"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
