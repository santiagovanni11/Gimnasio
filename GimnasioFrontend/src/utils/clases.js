// =========================================================
// UTILIDADES DE CLASES
// Días, franjas horarias y orden de horarios. Puente entre
// DayOfWeek de la API (0=domingo) y el formato en español.
// =========================================================

/** Día -> etiqueta, ordenado lunes a domingo. */
export const DIAS_SEMANA = [
  { valor: 1, etiqueta: "Lunes" },
  { valor: 2, etiqueta: "Martes" },
  { valor: 3, etiqueta: "Miércoles" },
  { valor: 4, etiqueta: "Jueves" },
  { valor: 5, etiqueta: "Viernes" },
  { valor: 6, etiqueta: "Sábado" },
  { valor: 0, etiqueta: "Domingo" },
];

export const diaSemanaTexto = (valor) =>
  DIAS_SEMANA.find((d) => d.valor === Number(valor))?.etiqueta ?? "-";

/** "18:00:00" -> "18:00" para mostrar. */
export const horaTexto = (valor) =>
  String(valor ?? "").slice(0, 5);

/** Franja legible de un horario: "18:00 a 19:00". */
export const franjaTexto = (horaInicio, horaFin) =>
  `${horaTexto(horaInicio)} a ${horaTexto(horaFin)}`;

/** Orden de lectura: día (lunes primero) y luego hora inicio. */
export const compararHorarios = (a, b) => {
  const indiceDia = (dia) =>
    DIAS_SEMANA.findIndex((d) => d.valor === Number(dia));

  const porDia = indiceDia(a.diaSemana) - indiceDia(b.diaSemana);

  return porDia !== 0
    ? porDia
    : String(a.horaInicio).localeCompare(String(b.horaInicio));
};

/**
 * Normaliza una hora del input ("18:00") al formato que
 * espera la API para TimeSpan ("18:00:00").
 */
export const horaParaApi = (valor) => {
  const texto = String(valor ?? "").trim();

  return texto.length === 5 ? `${texto}:00` : texto;
};

/** "HH:mm[:ss]" -> minutos desde medianoche; -1 si es inválida. */
export const horaAMinutos = (valor) => {
  const texto = String(valor ?? "").slice(0, 5);
  const [horasTxt, minutosTxt = "0"] = texto.split(":");

  const valido = /^\d{1,2}$/.test(horasTxt) &&
    /^\d{1,2}$/.test(minutosTxt);

  return valido
    ? Number(horasTxt) * 60 + Number(minutosTxt)
    : -1;
};

/**
 * ¿Dos franjas del MISMO día se superponen?
 * Tocarse en el borde (19:00-20:00 y 20:00-21:00) NO cuenta.
 */
export const franjasSuperponen = (i1, f1, i2, f2) => {
  const inicioA = horaAMinutos(i1);
  const finA = horaAMinutos(f1);
  const inicioB = horaAMinutos(i2);
  const finB = horaAMinutos(f2);

  if ([inicioA, finA, inicioB, finB].some((v) => v < 0)) {
    return false;
  }

  return inicioA < finB && inicioB < finA;
};
