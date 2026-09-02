// =========================================================
// HOOK DE ASISTENCIAS (FACHADA DE LA SECCIÓN)
// Fecha de trabajo (default hoy) → horarios del día →
// marcas por inscripto. Carga perezosa al activarse.
// =========================================================

import { useEffect, useMemo, useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { useClasesDatos } from "./useClasesDatos";
import { crearRegistroAsistencia } from "./crearRegistroAsistencia";
import { hoyISO } from "../utils/fechas";
import {
  diaSemanaDeFecha,
  asistenciasEnFecha,
} from "../utils/asistencias";

function textoDeMarca(presente, motivo) {
  if (presente) return "Asistencia registrada (Presente).";
  return motivo
    ? `Asistencia registrada (Ausente · ${motivo}).`
    : "Asistencia registrada (Ausente).";
}

export function useAsistencias({
  activo = true,
  onSesionExpirada,
}) {
  const [fecha, setFecha] = useState(hoyISO);
  const [mensaje, setMensaje] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const datos = useClasesDatos({ onSesionExpirada });

  const registro = crearRegistroAsistencia({
    ejecutar,
    obtenerAsistencias: datos.obtenerAsistencias,
    avisarError: datos.setError,
  });

  const { obtenerTodo } = datos;

  useEffect(() => {
    if (!activo) return;

    obtenerTodo();
  }, [activo, obtenerTodo]);

  // ---------------------------------------------------------
  // DERIVADOS DE LA FECHA SELECCIONADA
  // ---------------------------------------------------------

  const diaSemana = useMemo(
    () => diaSemanaDeFecha(fecha),
    [fecha]
  );

  const horariosDelDia = useMemo(
    () => {
      const clasesActivas = new Set(
        (datos.clases || [])
          .filter((c) => c.activa !== false)
          .map((c) => Number(c.id))
      );

      return datos.horarios
        .filter(
          (h) =>
            Number(h.diaSemana) === diaSemana &&
            h.activo !== false &&
            clasesActivas.has(Number(h.claseId))
        )
        .sort((a, b) =>
          String(a.horaInicio).localeCompare(String(b.horaInicio))
        );
    },
    [datos.horarios, datos.clases, diaSemana]
  );

  const asistenciasDelDia = useMemo(
    () => asistenciasEnFecha(datos.asistencias, fecha),
    [datos.asistencias, fecha]
  );

  /**
   * Inscriptos vigentes de un horario para una fecha dada
   * (excluye canceladas y cuya vigencia ya venció a esa fecha).
   */
  const inscriptosDe = useMemo(
    () =>
      (horarioId, fechaReferencia = hoyISO()) =>
        datos.inscripciones.filter(
          (i) =>
            Number(i.horarioClaseId) === Number(horarioId) &&
            Number(i.estado) !== 4 &&
            !(String(i.fechaHasta ?? "").slice(0, 10) &&
              String(i.fechaHasta).slice(0, 10) < fechaReferencia)
        ),
    [datos.inscripciones]
  );

  const marcar = async (params) => {
    const resultado = await registro.marcar(params);
    if (resultado) {
      setMensaje(textoDeMarca(params.presente, params.motivo));
    }
    return resultado;
  };

  const cambiarFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setMensaje("");
  };

  return {
    ...datos,
    mensaje,
    fecha,
    setFecha: cambiarFecha,
    horariosDelDia,
    asistenciasDelDia,
    inscriptosDe,
    marcar,
  };
}
