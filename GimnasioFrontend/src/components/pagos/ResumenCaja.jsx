// =========================================================
// RESUMEN DE CAJA — Métricas y gráficos del módulo pagos
// Cálculos puros en utils/resumenCaja; piezas en ResumenPiezas.
// =========================================================

import {
  calcularComparativaMensual,
  calcularDesgloseFormaPago,
  calcularIngresosPorMes,
  calcularIngresosPorPlan,
  calcularTotalDelDia,
  calcularTotalDelMes,
  calcularIngresosTotales,
  contarPorEstado,
} from "../../utils/resumenCaja";
import { ESTADO_PAGO } from "../../utils/pagos";
import { hoyISO } from "../../utils/fechas";
import { formatoMoneda } from "../../utils/pagos";
import {
  TarjetasPrincipales,
  DesgloseFormaPago,
  IngresosPorPlan,
} from "./ResumenPiezas";

function ResumenCaja({ pagos = [] }) {
  const hoy = new Date();

  const metricas = {
    totalDelDia: calcularTotalDelDia(pagos, hoyISO()),
    totalDelMes: calcularTotalDelMes(pagos, hoy),
    ingresosTotales: calcularIngresosTotales(pagos),
    rechazados: contarPorEstado(pagos, ESTADO_PAGO.RECHAZADO),
  };

  return (
    <>
      <TarjetasPrincipales metricas={metricas} />

      <section className="payment-breakdown-grid">
        <DesgloseFormaPago
          items={calcularDesgloseFormaPago(pagos)}
        />

        <IngresosPorPlan items={calcularIngresosPorPlan(pagos)} />

        <Comparativa comparativa={calcularComparativaMensual(pagos, hoy)} />

        <GraficoMensual meses={calcularIngresosPorMes(pagos, hoy)} />
      </section>
    </>
  );
}

function Comparativa({ comparativa }) {
  const { actual, previo, variacion } = comparativa;

  return (
    <div className="payment-breakdown-card">
      <h4>Comparativa mensual</h4>

      <div className="payment-breakdown-list">
        <FilaSimple nombre="Mes actual" monto={actual} />
        <FilaSimple nombre="Mes anterior" monto={previo} />

        <div className="payment-breakdown-row">
          <div className="payment-breakdown-info">
            <span className="payment-breakdown-name">Variación</span>
          </div>

          <span
            className={
              variacion === null
                ? "status-inactive"
                : variacion >= 0
                ? "status-active"
                : "status-rejected"
            }
          >
            {variacion === null
              ? "Sin datos previos"
              : `${variacion >= 0 ? "+" : ""}${variacion.toFixed(1)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

function FilaSimple({ nombre, monto }) {
  return (
    <div className="payment-breakdown-row">
      <div className="payment-breakdown-info">
        <span className="payment-breakdown-name">{nombre}</span>
      </div>
      <strong>{formatoMoneda(monto)}</strong>
    </div>
  );
}

function GraficoMensual({ meses }) {
  const maxMonto = Math.max(...meses.map((m) => m.monto), 1);

  return (
    <div className="payment-breakdown-card">
      <h4>Ingresos últimos 6 meses</h4>

      <div className="payment-chart">
        {meses.map((mes) => (
          <ColumnaGrafico
            key={mes.key}
            mes={mes}
            alturaRelativa={(mes.monto / maxMonto) * 100}
          />
        ))}
      </div>
    </div>
  );
}

function ColumnaGrafico({ mes, alturaRelativa }) {
  return (
    <div className="payment-chart-column">
      <div className="payment-chart-bar-wrap">
        <div
          className="payment-chart-bar"
          style={{ height: `${Math.max(alturaRelativa, 4)}%` }}
          title={formatoMoneda(mes.monto)}
        />
      </div>

      <span className="payment-chart-label">{mes.label}</span>

      <span className="payment-chart-value">
        {mes.monto > 0 ? `$${Math.round(mes.monto / 1000)}k` : "-"}
      </span>
    </div>
  );
}

export default ResumenCaja;
