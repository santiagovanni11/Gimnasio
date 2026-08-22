// =========================================================
// UTILIDADES DE FECHAS
// Rangos predefinidos para filtros (formato ISO yyyy-mm-dd).
// SIEMPRE se usa la fecha LOCAL (evita el desfase UTC que
// hacía que "hoy" cambiara a partir de las 21:00 en AR).
// =========================================================

/** yyyy-mm-dd de una Date, en horario local. */
export const aISO = (fecha) => {
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mm}-${dd}`;
};

/** yyyy-mm-dd de HOY, en horario local. */
export const hoyISO = () => aISO(new Date());

export const rangoHoy = () => {
  const hoy = hoyISO();
  return { desde: hoy, hasta: hoy };
};

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
