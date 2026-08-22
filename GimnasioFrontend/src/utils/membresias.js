// =========================================================
// UTILIDADES DE MEMBRESÍAS
// Estados, saldo pendiente y exportación. La lógica de
// rechazo por período vive en utils/pagosPeriodo.
// =========================================================

export const ESTADO_MEMBRESIA = {
  PENDIENTE: 1,
  ACTIVA: 2,
  VENCIDA: 3,
  SUSPENDIDA: 4,
  CANCELADA: 5,
};

export const estadoMembresiaTexto = (valor) => {
  const mapa = {
    [ESTADO_MEMBRESIA.PENDIENTE]: "Pendiente",
    [ESTADO_MEMBRESIA.ACTIVA]: "Activa",
    [ESTADO_MEMBRESIA.VENCIDA]: "Vencida",
    [ESTADO_MEMBRESIA.SUSPENDIDA]: "Suspendida",
    [ESTADO_MEMBRESIA.CANCELADA]: "Cancelada",
  };

  return mapa[Number(valor)] || "Desconocida";
};

/**
 * Membresías con saldo pendiente (morosos), excluyendo las
 * rechazadas del período. saldo = precioAplicado - aprobado.
 * @returns {Array<{...membresia, pagado, saldo}>}
 */
export const getMembresiasConSaldoPendiente = (
  membresias = [],
  totalAprobadoDelPeriodo,
  rechazadasIds
) => {
  return membresias
    .filter((m) => !rechazadasIds?.has(Number(m.id)))
    .map((m) => {
      const pagado =
        totalAprobadoDelPeriodo.get(Number(m.id)) || 0;
      const saldo = Number(m.precioAplicado || 0) - pagado;
      return { ...m, pagado, saldo };
    })
    .filter((m) => m.saldo > 0);
};

/**
 * Socios sin membresía vigente: excluye a quienes tienen una
 * membresía Activa o Pendiente no rechazada. Las rechazadas
 * quedan disponibles para asignarles una nueva manualmente.
 */
export const sociosSinMembresiaActiva = (
  socios = [],
  membresias = [],
  rechazadasIds
) =>
  socios.filter(
    (socio) =>
      !membresias.some(
        (m) =>
          Number(m.socioId) === Number(socio.id) &&
          (Number(m.estado) === 1 || Number(m.estado) === 2) &&
          !rechazadasIds?.has(Number(m.id))
      )
  );

/**
 * Descarga el listado de membresías como CSV.
 */
export const exportarMembresiasCsv = (membresias = []) => {
  if (!membresias.length) return;

  const encabezados = [
    "Socio",
    "Plan",
    "Precio",
    "Fecha inicio",
    "Vencimiento",
    "Estado",
  ];

  const filas = membresias.map((m) => [
    `${m.socioNombre || ""} ${m.socioApellido || ""}`.trim(),
    m.planNombre,
    m.precioAplicado,
    m.fechaInicio
      ? new Date(m.fechaInicio).toLocaleDateString("es-AR")
      : "",
    m.fechaFin
      ? new Date(m.fechaFin).toLocaleDateString("es-AR")
      : "",
    estadoMembresiaTexto(m.estado),
  ]);

  const csv = [encabezados, ...filas]
    .map((fila) =>
      fila.map((celda) => `"${String(celda ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `membresias_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
