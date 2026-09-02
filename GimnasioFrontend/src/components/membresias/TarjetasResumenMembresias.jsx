// =========================================================
// TARJETAS RESUMEN DE MEMBREÍAS
// Estado de salud de la base en un vistazo: activas, por
// vencer, vencidas y suspendidas.
// =========================================================

import { calcularResumenMembresias } from "../../utils/resumenMembresias";

function TarjetasResumenMembresias({ membresias = [] }) {
  const resumen = calcularResumenMembresias(membresias);

  const tarjetas = [
    {
      clase: "accent",
      titulo: "Activas",
      valor: resumen.activas,
      nota: "En regla hoy",
    },
    {
      clase: "warning",
      titulo: "Por vencer (7 días)",
      valor: resumen.porVencer,
      nota: "Ventana de renovación",
    },
    {
      clase: "danger",
      titulo: "Vencidas",
      valor: resumen.vencidas,
      nota: "Requieren gestión",
    },
    {
      clase: "inactive",
      titulo: "Suspendidas",
      valor: resumen.suspendidas,
      nota: "Congeladas temporalmente",
    },
  ];

  return (
    <section className="payment-summary-grid">
      {tarjetas.map((tarjeta) => (
        <div
          key={tarjeta.titulo}
          className={`payment-summary-card ${tarjeta.clase}`}
        >
          <span>{tarjeta.titulo}</span>
          <strong>{tarjeta.valor}</strong>
          <small>{tarjeta.nota}</small>
        </div>
      ))}
    </section>
  );
}

export default TarjetasResumenMembresias;
