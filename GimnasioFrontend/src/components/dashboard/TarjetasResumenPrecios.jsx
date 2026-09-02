// =========================================================
// TARJETAS RESUMEN DE PRECIOS
// Estado de la configuración de planes en un vistazo:
// total, activos, pausados y precio promedio mensual.
// =========================================================

import { formatoMoneda } from "../../utils/pagos";

function TarjetasResumenPrecios({ planes = [] }) {
  const total = planes.length;
  const activos = planes.filter((p) => p.activo !== false).length;
  const pausados = total - activos;

  const conPrecio = planes.filter((p) => Number(p.precio1Mes) > 0);
  const promedio = conPrecio.length
    ? Math.round(
        conPrecio.reduce((acc, p) => acc + Number(p.precio1Mes), 0) /
          conPrecio.length
      )
    : 0;

  const tarjetas = [
    { clase: "accent", titulo: "Planes", valor: total, nota: "En configuración" },
    { clase: "active", titulo: "Activos", valor: activos, nota: "Disponibles" },
    { clase: "inactive", titulo: "Pausados", valor: pausados, nota: "Ocultos al alta" },
    {
      clase: "warning",
      titulo: "Precio promedio",
      valor: promedio ? formatoMoneda(promedio) : "—",
      nota: "Plan mensual",
    },
  ];

  return (
    <section className="payment-summary-grid">
      {tarjetas.map((t) => (
        <div key={t.titulo} className={`payment-summary-card ${t.clase}`}>
          <span>{t.titulo}</span>
          <strong>{t.valor}</strong>
          <small>{t.nota}</small>
        </div>
      ))}
    </section>
  );
}

export default TarjetasResumenPrecios;
