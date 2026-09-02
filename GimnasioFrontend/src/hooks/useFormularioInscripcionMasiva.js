// =========================================================
// FORMULARIO DE INSCRIPCIÓN MASIVA
// Selección de varios socios y un horario de destino. La
// capacidad y los duplicados los revalida la API por socio.
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { clasesService } from "../services/clasesService";
import { hoyISO } from "../utils/fechas";

export function useFormularioInscripcionMasiva({
  onSesionExpirada,
  obtenerTodo,
  notificar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [seleccionIds, setSeleccionIds] = useState([]);
  const [claseId, setClaseId] = useState("");
  const [horarioId, setHorarioId] = useState("");
  const [fechaVigencia, setFechaVigencia] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const abrir = () => {
    setSeleccionIds([]);
    setClaseId("");
    setHorarioId("");
    setFechaVigencia("");
    setError("");
    setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  /** Marca/desmarca un socio de la lista seleccionada. */
  const alternarSocio = (socioId) =>
    setSeleccionIds((prev) =>
      prev.includes(socioId)
        ? prev.filter((id) => id !== socioId)
        : [...prev, socioId]
    );

  const guardar = async (event) => {
    event.preventDefault();

    if (!seleccionIds.length) {
      setError("Seleccioná al menos un socio.");
      return;
    }

    if (!horarioId) {
      setError("Seleccioná un horario de destino.");
      return;
    }

    if (fechaVigencia && fechaVigencia < hoyISO()) {
      setError("La vigencia no puede ser una fecha pasada.");
      return;
    }

    setGuardando(true);
    setError("");

    const resultado = await ejecutar({
      peticion: () =>
        clasesService.inscribirMasivo({
          horarioClaseId: Number(horarioId),
          sociosIds: seleccionIds,
          fechaHasta: fechaVigencia || null,
        }),
      onError: setError,
      mensajePermiso:
        "No tenés permisos para gestionar inscripciones.",
      mensajeError:
        "No se pudo completar la inscripción masiva.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al inscribir varios socios:",
    });

    setGuardando(false);

    if (!resultado) return;

    const datos = resultado.datos ?? {};
    const errores = Array.isArray(datos.errores)
      ? datos.errores
      : [];
    const inscriptos = Number(datos.inscriptos ?? 0);

    setAbierto(false);
    await obtenerTodo?.();

    notificar?.(
      errores.length > 0
        ? `Se inscribieron ${inscriptos} socios. No pudieron: ${errores.join(". ")}`
        : `${inscriptos} socios inscriptos correctamente.`
    );
  };

  return {
    inscripcionMasivaAbierta: abierto,
    seleccionIdsMasiva: seleccionIds,
    alternarSocioMasiva: alternarSocio,
    claseDestinoMasiva: claseId,
    seleccionarClaseMasiva: (id) => {
      setClaseId(id);
      setHorarioId("");
      setError("");
    },
    horarioDestinoMasiva: horarioId,
    seleccionarHorarioMasiva: (id) => {
      setHorarioId(id);
      setError("");
    },
    fechaVigenciaMasiva: fechaVigencia,
    seleccionarFechaVigenciaMasiva: setFechaVigencia,
    guardandoInscripcionMasiva: guardando,
    errorInscripcionMasiva: error,
    abrirInscripcionMasiva: abrir,
    cerrarInscripcionMasiva: cerrar,
    guardarInscripcionMasiva: guardar,
  };
}