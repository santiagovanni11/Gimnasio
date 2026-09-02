import { ESTADO_PAGO } from "./pagos";

const KEY = "gimnasio-membresias-meta-v1";

const leerMeta = () => {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    return {};
  }
};

const guardarMeta = (meta) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(meta));
};

export const obtenerEventosMembresia = (id) => {
  const meta = leerMeta();
  return Array.isArray(meta[Number(id)]) ? meta[Number(id)] : [];
};

export const registrarEventoMembresia = (id, accion, detalle, usuario = "Sistema") => {
  const clave = Number(id);
  const meta = leerMeta();
  const eventos = Array.isArray(meta[clave]) ? meta[clave] : [];
  eventos.unshift({
    id: Date.now(),
    accion,
    detalle,
    usuario,
    fecha: new Date().toISOString(),
  });
  meta[clave] = eventos.slice(0, 20);
  guardarMeta(meta);
  return meta[clave];
};

export const registrarRenovacionMembresia = (membresia, usuario = "Sistema") => {
  const detalle = `${membresia?.planNombre || "Plan"} · ${membresia?.precioAplicado ?? 0} · ${membresia?.fechaInicio || "-"} → ${membresia?.fechaFin || "-"}`;
  return registrarEventoMembresia(membresia?.id, "Renovación de membresía", detalle, usuario);
};

export const resumenIngresosPorPlan = (membresias = [], pagos = []) => {
  const mapa = new Map();
  pagos.filter((p) => Number(p.estado) === 2).forEach((pago) => {
    const membresia = membresias.find((m) => Number(m.id) === Number(pago.membresiaId));
    if (!membresia) return;
    const plan = membresia.planNombre || "Sin plan";
    const actual = mapa.get(plan) || { plan, total: 0, mes: new Map() };
    actual.total += Number(pago.monto || 0);
    const key = new Date(pago.fechaPago).toISOString().slice(0, 7);
    actual.mes.set(key, (actual.mes.get(key) || 0) + Number(pago.monto || 0));
    mapa.set(plan, actual);
  });
  return [...mapa.values()].map((item) => ({
    plan: item.plan,
    total: item.total,
    mes: [...item.mes.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-3),
  })).sort((a, b) => b.total - a.total);
};

export const alertasOperativasMembresias = (membresias = [], pagos = []) => {
  const alertas = [];
  const hoy = new Date();
  const en7 = new Date(hoy); en7.setDate(hoy.getDate() + 7);

  membresias.forEach((m) => {
    const pagosDeMembresia = pagos.filter((p) => Number(p.membresiaId) === Number(m.id));
    const ultimoPago = [...pagosDeMembresia].sort((a, b) => {
      const fechaA = new Date(a.fechaPago || 0).getTime();
      const fechaB = new Date(b.fechaPago || 0).getTime();
      return fechaB - fechaA;
    })[0];

    const deuda = Number(m.precioAplicado || 0) - (
      pagosDeMembresia
        .filter((p) => Number(p.estado) === ESTADO_PAGO.APROBADO)
        .reduce((sum, p) => sum + Number(p.monto || 0), 0)
    );

    const requiereCobro =
      Number(ultimoPago?.estado) === ESTADO_PAGO.RECHAZADO || deuda > 0;

    if (requiereCobro && Number(ultimoPago?.estado) !== ESTADO_PAGO.APROBADO) {
      const monto = Math.max(0, deuda || Number(m.precioAplicado || 0));
      alertas.push({
        tipo: "deuda",
        texto: `${m.socioNombre} ${m.socioApellido}: debe ${new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(monto)}`,
      });
    }

    const fechaFin = m.fechaFin ? new Date(m.fechaFin) : null;
    if (fechaFin && fechaFin <= en7 && Number(m.estado) === 2) {
      alertas.push({ tipo: "por_vencer", texto: `${m.socioNombre} ${m.socioApellido}: vence el ${new Date(m.fechaFin).toLocaleDateString("es-AR")}` });
    }
  });

  return alertas.slice(0, 6);
};

export const etiquetaEstadoOperativo = (membresia) => {
  const fin = membresia?.fechaFin ? new Date(membresia.fechaFin) : null;
  if (Number(membresia?.estado) === 5) return "Cancelada";
  if (Number(membresia?.estado) === 4) return "Suspendida";
  if (Number(membresia?.estado) === 3 || (fin && fin < new Date())) return "Vencida";
  if (membresia?.renovacionAutomatica) return "Renovación";
  if (fin && fin <= new Date(Date.now() + 7 * 86400000)) return "Por vencer";
  return "Activa";
};
