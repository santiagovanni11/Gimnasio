// =========================================================
// ESTADÍSTICAS DE SOCIOS — Tarjetas resumen + barras
// Consulta el endpoint /estadisticas y muestra métricas
// clave con un gráfico simple de altas por mes.
// =========================================================

import { useEffect, useState } from "react";
import { sociosService } from "../../services/sociosService";

const TARJETAS = [
  ["total", "Total socios"],
  ["activos", "Activos"],
  ["inactivos", "Inactivos"],
  ["nuevosMes", "Nuevos este mes"],
  ["cumpleMes", "Cumpleañeros"],
  ["vencidas", "Membresías vencidas"],
  ["porVencer", "Por vencer (7 d)"],
];

export default function EstadisticasSocios() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const { respuesta, datos } =
        await sociosService.obtenerEstadisticas();

      if (respuesta.ok) setStats(datos);
      else setError(
        `No se pudieron cargar las estadísticas (HTTP ${respuesta.status}).`
      );
    };

    cargar();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!stats) return null;

  const max = Math.max(
    1,
    ...stats.altasPorMes.map((m) => m.cantidad)
  );

  return (
    <section className="content-card">
      <h3>Resumen de socios</h3>

      <div className="stats-grid">
        {TARJETAS.map(([clave, etiqueta]) => (
          <div className="stat-card" key={clave}>
            <strong>{stats[clave]}</strong>
            <span>{etiqueta}</span>
          </div>
        ))}
      </div>

      <h4>Altas por mes (últimos 6)</h4>

      <div className="bar-chart">
        {stats.altasPorMes.map((m) => (
          <div className="bar-row" key={m.mes}>
            <span className="bar-label">{m.mes.slice(2)}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(m.cantidad / max) * 100}%` }}
              />
            </div>
            <span className="bar-value">{m.cantidad}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
