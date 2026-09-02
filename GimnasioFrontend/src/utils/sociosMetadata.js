import { getMembresiasConSaldoPendiente } from "./membresias";
import { getMembresiaVisual } from "./membresiaVisual";
import { totalAprobadoDelPeriodoPorMembresia } from "./pagosPeriodo";

const STORAGE_KEY = "gimnasio-socios-meta-v1";

const leerMeta = () => {
  if (typeof localStorage === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const guardarMeta = (meta) => {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // Ignorado: el navegador puede bloquear almacenamiento local.
  }
};

const claveSocio = (socioId) => Number(socioId || 0);

export const obtenerMetaSocio = (socioId) => {
  const meta = leerMeta();
  const guardado = meta[claveSocio(socioId)] ?? {};
  return {
    notas: Array.isArray(guardado.notas) ? guardado.notas : [],
    historial: Array.isArray(guardado.historial) ? guardado.historial : [],
  };
};

export const guardarMetaSocio = (socioId, actualizacion) => {
  const actual = obtenerMetaSocio(socioId);
  const meta = leerMeta();
  const id = claveSocio(socioId);
  const compuesto = { ...actual, ...actualizacion };
  meta[id] = compuesto;
  guardarMeta(meta);
  return compuesto;
};

export const agregarNotaSocio = (socioId, texto, autor = "Sistema") => {
  const contenido = String(texto || "").trim();
  if (!contenido) return obtenerMetaSocio(socioId).notas;

  const nota = {
    id: Date.now(),
    texto: contenido,
    autor,
    fecha: new Date().toISOString(),
  };

  const meta = guardarMetaSocio(socioId, {
    notas: [nota, ...obtenerMetaSocio(socioId).notas],
  });

  return meta.notas;
};

export const registrarCambioSocio = (
  socioId,
  accion,
  detalle,
  autor = "Sistema"
) => {
  const cambio = {
    id: Date.now(),
    accion,
    detalle,
    autor,
    fecha: new Date().toISOString(),
  };

  const meta = guardarMetaSocio(socioId, {
    historial: [cambio, ...obtenerMetaSocio(socioId).historial],
  });

  return meta.historial;
};

export const obtenerEstadoRealSocio = (
  socio,
  { membresias = [], pagos = [], rechazadasIds = new Set(), hoy = new Date() } = {}
) => {
  if (socio?.activo === false) return "inactivo";

  const pagadoPorMembresia = totalAprobadoDelPeriodoPorMembresia(pagos, membresias);
  const conDeuda = getMembresiasConSaldoPendiente(
    membresias,
    pagadoPorMembresia,
    rechazadasIds
  ).some((m) => Number(m.socioId) === Number(socio?.id));

  if (conDeuda) return "moroso";

  const visual = getMembresiaVisual(socio, membresias, rechazadasIds);

  if (!visual?.membresia) return "sin_membresia";
  if (visual.texto === "Vencida") return "vencido";
  if (visual.texto === "Rechazada") return "vencido";
  if (visual.texto === "Por vencer") return "por_vencer";

  const fechaNacimiento = socio?.fechaNacimiento
    ? new Date(socio.fechaNacimiento)
    : null;

  if (
    fechaNacimiento &&
    !Number.isNaN(fechaNacimiento.getTime()) &&
    fechaNacimiento.getMonth() === hoy.getMonth() &&
    fechaNacimiento.getDate() === hoy.getDate()
  ) {
    return "cumpleanero";
  }

  return "activo";
};
