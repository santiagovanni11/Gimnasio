// =========================================================
// UTILIDADES DE PLANES
// Single Responsibility: toda la lógica de presentación
// de planes centralizada aquí. Escalable si se agregan
// nuevos tipos (Premium, Básico, VIP, etc.).
// =========================================================

export const PLAN_TIPO = {
  BASICO: "Basico",
  PREMIUM: "Premium",
};

/**
 * Normaliza y retorna el nombre del plan para mostrar.
 * Prioriza planNombre del DTO; fallback a planId o genérico.
 */
/**
 * Retorna el nombre del plan para un pago.
 * @param {object} pago - Objeto pago del API
 * @param {Array} membresias - Lista opcional de membresías para hacer join si el pago no trae planNombre
 */
export const getPlanNombre = (pago, membresias = []) => {
  if (!pago) return "Sin plan";

  // 1) Prioridad: campo directo del DTO (nuevo backend)
  const raw =
    pago.planNombre ??
    pago.PlanNombre ??
    pago.plan_nombre ??
    "";

  const nombre = String(raw).trim();

  if (nombre !== "") {
    return nombre;
  }

  // 2) Deducción por planId directo
  const planId = pago.planId ?? pago.PlanId;
  if (Number(planId) === 1) return "Plan Básico";
  if (Number(planId) === 2) return "Plan Premium";

  // 3) Fallback robusto: join con membresías (útil si el pago está cacheado viejo sin planNombre)
  if (Array.isArray(membresias) && membresias.length && pago.membresiaId) {
    const mem = membresias.find(
      (m) => Number(m.id) === Number(pago.membresiaId)
    );
    if (mem) {
      const memPlanNombre =
        mem.planNombre ?? mem.PlanNombre ?? mem.nombrePlan ?? "";
      const memNombre = String(memPlanNombre).trim();
      if (memNombre !== "") {
        return memNombre;
      }
      // Si la membresía tiene planId, deducir
      const memPlanId = mem.planId ?? mem.PlanId;
      if (Number(memPlanId) === 1) return "Plan Básico";
      if (Number(memPlanId) === 2) return "Plan Premium";
    }
  }

  return "Sin plan";
};

/**
 * Precio del plan según la duración en meses (1/3/6/12).
 * Única implementación compartida por el formulario de
 * membresías y la configuración de precios.
 */
export const precioSegunDuracion = (plan, duracion) => {
  if (!plan || !duracion) return 0;

  const precios = {
    1: plan.precio1Mes,
    3: plan.precio3Meses,
    6: plan.precio6Meses,
    12: plan.precio12Meses,
  };

  const precio = precios[Number(duracion)];
  return precio !== undefined ? Number(precio) : Number(plan.precio ?? 0);
};

/**
 * Coincidencia del filtro de plan ("premium"/"basico"),
 * insensible a acentos y mayúsculas.
 */
export const coincideFiltroPlan = (
  pago,
  filtroPlan,
  membresias = []
) => {
  if (!filtroPlan) return true;

  const nombre = getPlanNombre(pago, membresias)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return nombre.includes(filtroPlan);
};

/**
 * Retorna true si el plan es Premium (case-insensitive).
 */
export const esPlanPremium = (nombrePlan) =>
  String(nombrePlan).toLowerCase().includes("premium");

/**
 * Retorna clase CSS según tipo de plan para badge visual.
 */
export const getPlanBadgeClase = (nombrePlan) => {
  if (esPlanPremium(nombrePlan)) return "plan-badge plan-premium";
  if (String(nombrePlan).toLowerCase().includes("basico") || String(nombrePlan).toLowerCase().includes("básico"))
    return "plan-badge plan-basico";
  return "plan-badge";
};
