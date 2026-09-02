// =========================================================
// RESUMEN DE WIDGETS DEL INICIO
// Cálculos puros para los paneles Morosos, Vencen hoy,
// Top clases e Inscritos hoy. Separados de la presentación
// para mantener los componentes pequeños y testeables.
// =========================================================

import { ocupaCupo } from "./inscripcionesClase";
import { getMembresiasConSaldoPendiente } from "./membresias";
import { diasParaVencer } from "./vencimientosMembresia";
import { formatoMoneda } from "./pagos";

/** Membresías ACTIVAS que vencen el día de hoy. */
export const membresiasQueVencenHoy = (membresias = []) =>
  membresias.filter(
    (m) => Number(m.estado) === 2 && diasParaVencer(m.fechaFin) === 0
  );

/**
 * Morosos: membresías con saldo adeudado, ordenadas por mayor
 * deuda y limitadas a `tope`. Reusa la regla de saldos.
 */
export const morosos = (
  membresias = [],
  totalAprobado,
  rechazadasIds,
  tope = 6
) =>
  getMembresiasConSaldoPendiente(
    membresias,
    totalAprobado,
    rechazadasIds
  )
    .sort((a, b) => Number(b.saldo) - Number(a.saldo))
    .slice(0, tope);

/** Nombre legible de un socio de la membresía. */
export const nombreDeMembresia = (m) =>
  `${m.socioNombre || ""} ${m.socioApellido || ""}`.trim() || "Socio";

/** Inscriptos vigentes de un horario. */
const conteoInscriptos = (inscripciones, horarioId, hoy) =>
  inscripciones.filter(
    (i) =>
      Number(i.horarioClaseId) === Number(horarioId) &&
      ocupaCupo(i, hoy)
  );

/**
 * Top clases de hoy por cantidad de inscriptos, de mayor a
 * menor. Devuelve el `tope` superior con nombre, hora y cupo.
 */
export const topClasesDeHoy = (
  horariosDelDia = [],
  clases = [],
  inscripciones = [],
  tope = 5
) => {
  const hoy = new Date();

  return horariosDelDia
    .map((h) => {
      const clase = clases.find((c) => Number(c.id) === Number(h.claseId));
      return {
        id: h.id,
        nombre: clase?.nombre ?? "Clase",
        hora: h.horaInicio,
        cantidad: conteoInscriptos(inscripciones, h.id, hoy).length,
      };
    })
    .filter((f) => f.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, tope);
};

/**
 * Inscritos del día: para cada horario de hoy con inscriptos,
 * devuelve la clase, la hora y los nombres de los socios.
 */
export const inscritosDeHoy = (
  horariosDelDia = [],
  clases = [],
  inscripciones = []
) => {
  const hoy = new Date();

  return horariosDelDia
    .map((h) => {
      const clase = clases.find((c) => Number(c.id) === Number(h.claseId));
      const socios = conteoInscriptos(inscripciones, h.id, hoy)
        .map((i) => `${i.socioNombre || ""} ${i.socioApellido || ""}`.trim())
        .filter(Boolean);

      return {
        hora: h.horaInicio,
        clase: clase?.nombre ?? "Clase",
        socios,
      };
    })
    .filter((f) => f.socios.length > 0);
};

export { formatoMoneda };
