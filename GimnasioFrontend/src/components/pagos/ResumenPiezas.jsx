// =========================================================
// PIEZAS DEL RESUMEN DE CAJA
// Tarjetas principales, listas de líneas y desgloses.
// =========================================================

import { formatoMoneda } from "../../utils/pagos";

function TarjetasPrincipales({ metricas }) {
  const tarjetas = [
    { clase: "accent", titulo: "Total del día", valor: metricas.totalDelDia, nota: "Cobros registrados hoy" },
    { clase: "", titulo: "Total del mes", valor: metricas.totalDelMes, nota: "Ingresos del mes actual" },
    { clase: "", titulo: "Ingresos totales", valor: metricas.ingresosTotales, nota: "Historial del sistema" },
    { clase: "warning", titulo: "Rechazados", valor: metricas.rechazados, nota: "Pagos no acreditados", crudo: true },
  ];

  return (
    <section className="payment-summary-grid">
      {tarjetas.map((t) => (
        <div key={t.titulo} className={`payment-summary-card ${t.clase}`}>
          <span>{t.titulo}</span>
          <strong>{t.crudo ? t.valor : formatoMoneda(t.valor)}</strong>
          <small>{t.nota}</small>
        </div>
      ))}
    </section>
  );
}

function ListaLineas({ items }) {
  return (
    <div className="payment-breakdown-list">
      {items.map((item) => (
        <div key={item.key} className="payment-breakdown-row">
          <div className="payment-breakdown-info">
            <span className="payment-breakdown-name">{item.nombre}</span>
            <span className="payment-breakdown-count">{item.cantidad}</span>
          </div>
          <strong>{formatoMoneda(item.monto)}</strong>
        </div>
      ))}
    </div>
  );
}

function DesgloseFormaPago({ items }) {
  return (
    <TarjetaDesglose titulo="Desglose por forma de pago">
      <ListaLineas
        items={items.map((i) => ({
          key: i.forma,
          nombre: i.nombre,
          cantidad: plural(i.cantidad),
          monto: i.monto,
        }))}
      />
    </TarjetaDesglose>
  );
}

function IngresosPorPlan({ items }) {
  return (
    <TarjetaDesglose titulo="Ingresos por plan">
      {items.length === 0 ? (
        <p className="empty-state">Sin ingresos registrados.</p>
      ) : (
        <ListaLineas
          items={items.map((i) => ({
            key: i.plan,
            nombre: i.plan,
            cantidad: plural(i.cantidad),
            monto: i.monto,
          }))}
        />
      )}
    </TarjetaDesglose>
  );
}

function TarjetaDesglose({ titulo, children }) {
  return (
    <div className="payment-breakdown-card">
      <h4>{titulo}</h4>
      {children}
    </div>
  );
}

const plural = (n) => `${n} pago${n !== 1 ? "s" : ""}`;

export {
  TarjetasPrincipales,
  ListaLineas,
  DesgloseFormaPago,
  IngresosPorPlan,
};
