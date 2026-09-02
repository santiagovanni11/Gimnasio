// GraficoIngresos — Barras de los últimos 6 meses (SVG/CSS puro).
export default function GraficoIngresos({ datos = [] }) {
  const max = Math.max(1, ...datos.map((d) => d.total));

  return (
    <div className="panel-inicio grafico-ingresos">
      <div className="panel-inicio-cabecera">
        <h3>Ingresos · últimos 6 meses</h3>
      </div>

      <div className="grafico-barras">
        {datos.map((d) => (
          <div className="grafico-columna" key={d.mes}>
            <span className="grafico-valor">
              {d.total > 0 ? `$${Math.round(d.total / 1000)}k` : ""}
            </span>
            <div
              className="grafico-barra"
              style={{ height: `${Math.round((d.total / max) * 100)}%` }}
            />
            <span className="grafico-mes">{d.mes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
