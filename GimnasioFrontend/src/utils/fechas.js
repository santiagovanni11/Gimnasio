// =========================================================
// UTILIDADES DE FECHAS
// Rangos predefinidos para filtros (formato ISO yyyy-mm-dd).
// SIEMPRE se usa la fecha LOCAL (evita el desfase UTC que
// hacía que "hoy" cambiara a partir de las 21:00 en AR).
// =========================================================

/** Milisegundos en un día (cálculos de diferencia de fechas). */
export const MS_POR_DIA = 86400000;

/** yyyy-mm-dd de una Date, en horario local. */
export const aISO = (fecha) => {
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mm}-${dd}`;
};

/** yyyy-mm-dd de HOY, en horario local. */
export const hoyISO = () => aISO(new Date());

/**
 * Date en horario local desde cualquier valor de la API.
 * Las fechas sueltas (yyyy-mm-dd) se interpretan como día
 * calendario local: `new Date("2026-01-15")` directo sería
 * medianoche UTC y, al formatear en local, correría un día.
 */
export const fechaDesdeValor = (valor) => {
  const texto = String(valor ?? "");

  return /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ? new Date(
        Number(texto.slice(0, 4)),
        Number(texto.slice(5, 7)) - 1,
        Number(texto.slice(8, 10))
      )
    : new Date(texto);
};

/** Fecha local legible (dd/mm/aaaa) o vacío. */
export const fechaTexto = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "";

/** Detecta si el ISO trae zona horaria explícita (Z u offset). */
const tieneZona = (texto) =>
  /z$/i.test(texto) || /[+-]\d{2}:?\d{2}$/.test(texto);

/**
 * Date desde una marca de tiempo de la API guardada en UTC.
 * SQL Server pierde el Kind y la API emite el ISO sin sufijo
 * Z; sin este ajuste el navegador la interpreta como hora
 * local y muestra la hora UTC corrida.
 * Solo para ISO completos de fecha+hora (no fechas sueltas).
 */
export const fechaDesdeUtc = (valor) => {
  if (!valor) return null;

  const texto = String(valor);

  return new Date(tieneZona(texto) ? texto : `${texto}Z`);
};

/** Fecha + hora local legible (dd/mm/aaaa, hh:mm) o vacío. */
export const fechaHoraTexto = (valor) => {
  const fecha = fechaDesdeUtc(valor);

  return fecha ? fecha.toLocaleString("es-AR") : "";
};

export const rangoHoy = () => {
  const hoy = hoyISO();
  return { desde: hoy, hasta: hoy };
};

/** Lunes de la semana en curso (local). */
const inicioSemana = () => {
  const ahora = new Date();
  const diasDesdeLunes = (ahora.getDay() + 6) % 7;

  return new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate() - diasDesdeLunes
  );
};

/** Semana en curso: lunes -> hoy. */
export const rangoSemanaActual = () => ({
  desde: aISO(inicioSemana()),
  hasta: hoyISO(),
});

export const rangoMesActual = () => {
  const ahora = new Date();
  const primero = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  return { desde: aISO(primero), hasta: aISO(ahora) };
};

export const rangoMesAnterior = () => {
  const ahora = new Date();
  const primero = new Date(
    ahora.getFullYear(),
    ahora.getMonth() - 1,
    1
  );
  const ultimo = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
  return { desde: aISO(primero), hasta: aISO(ultimo) };
};
