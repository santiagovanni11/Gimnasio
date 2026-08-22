// =========================================================
// UTILIDADES DE SOCIOS
// =========================================================

/**
 * Socios activos que cumplen años en el mes actual,
 * ordenados por día.
 */
export const getCumpleanosDelMes = (socios = [], hoy = new Date()) => {
  const mesActual = hoy.getMonth();

  return socios
    .filter((socio) => socio.activo !== false)
    .filter((socio) => {
      if (!socio.fechaNacimiento) return false;
      const fecha = new Date(socio.fechaNacimiento);
      return !Number.isNaN(fecha.getTime()) && fecha.getMonth() === mesActual;
    })
    .sort((a, b) => {
      const diaA = new Date(a.fechaNacimiento).getDate();
      const diaB = new Date(b.fechaNacimiento).getDate();
      return diaA - diaB;
    });
};

/**
 * Membresías que vencen exactamente en `dias` días
 * (por defecto mañana). Excluye las rechazadas.
 */
export const getVencimientosProximos = (
  membresias = [],
  membresiasRechazadasIds,
  dias = 1,
  hoy = new Date()
) => {
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + dias);
  const limiteISO = limite.toISOString().slice(0, 10);

  return membresias.filter(
    (m) =>
      !membresiasRechazadasIds?.has(Number(m.id)) &&
      (m.fechaFin || "").slice(0, 10) === limiteISO
  );
};

/**
 * Visualización de la membresía de un socio.
 * Prioriza la última membresía válida (no rechazada);
 * si todas están rechazadas muestra "Rechazada".
 */
export const getMembresiaVisual = (
  socio,
  membresias = [],
  membresiasRechazadasIds
) => {
  const delSocio = membresias.filter(
    (m) => Number(m.socioId) === Number(socio?.id)
  );

  const validas = delSocio.filter(
    (m) => !membresiasRechazadasIds?.has(Number(m.id))
  );

  if (validas.length > 0) {
    const ultima = [...validas].sort(
      (a, b) =>
        new Date(b.fechaFin) - new Date(a.fechaFin) ||
        Number(b.id) - Number(a.id)
    )[0];

    const estados = {
      1: "Pendiente",
      2: "Vigente",
      3: "Vencida",
      4: "Suspendida",
      5: "Cancelada",
    };

    const texto =
      estados[ultima.estado] ||
      (typeof ultima.estado === "string" ? ultima.estado : "Desconocida");

    const clases = {
      Vigente: "status-active",
      "Por vencer": "status-warning",
      Vencida: "status-expired",
      Pendiente: "status-warning",
    };

    return {
      texto,
      clase: clases[texto] || "status-inactive",
      fechaFin: ultima.fechaFin,
      membresia: ultima,
    };
  }

  if (membresiasRechazadasIds?.has(Number(socio?.membresia?.id))) {
    return { texto: "Rechazada", clase: "status-rejected", fechaFin: null };
  }

  const estado = socio?.membresia?.estado;
  const clases = {
    Vigente: "status-active",
    "Por vencer": "status-warning",
    Vencida: "status-expired",
  };

  return {
    texto: estado || "Sin membresía",
    clase: clases[estado] || "status-inactive",
    fechaFin: socio?.membresia?.fechaFin || null,
  };
};

/**
 * Descarga el listado de socios como CSV.
 */
export const exportarSociosCsv = (socios = []) => {
  if (!socios.length) return;

  const encabezados = [
    "Nombre",
    "Apellido",
    "DNI",
    "Fecha nacimiento",
    "Teléfono",
    "Email",
    "Dirección",
    "Estado",
    "Membresía",
    "Vencimiento",
  ];

  const filas = socios.map((s) => [
    s.nombre,
    s.apellido,
    s.dni,
    s.fechaNacimiento
      ? new Date(s.fechaNacimiento).toLocaleDateString("es-AR")
      : "",
    s.telefono,
    s.email,
    s.direccion || "",
    s.activo === false ? "Inactivo" : "Activo",
    s.membresia?.estado || "Sin membresía",
    s.membresia?.fechaFin
      ? new Date(s.membresia.fechaFin).toLocaleDateString("es-AR")
      : "",
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
  link.download = `socios_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
