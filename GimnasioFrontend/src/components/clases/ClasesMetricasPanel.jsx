import { mejoresClases, horariosMasOcupados } from "../../utils/clasesOperativas";
import { diaSemanaTexto, franjaTexto } from "../../utils/clases";

function ClasesMetricasPanel({ clases = [], horarios = [], inscripciones = [] }) {
  const topClases = mejoresClases(clases, horarios, inscripciones);
  const topHorarios = horariosMasOcupados(
    horarios,
    inscripciones,
    Math.max(...clases.map((clase) => Number(clase.capacidadMaxima) || 0), 0)
  );

  const metricas = [
    {
      titulo: "Más concurridas",
      valor: topClases[0]?.nombre ?? "Sin datos",
      nota: topClases[0] ? `${topClases[0].ocupados} ocupados` : "Sin clase activa",
    },
    {
      titulo: "Horarios altos",
      valor: topHorarios[0]
        ? `${diaSemanaTexto(topHorarios[0].diaSemana)} · ${franjaTexto(topHorarios[0].horaInicio, topHorarios[0].horaFin)}`
        : "Sin horario",
      nota: topHorarios[0] ? `${topHorarios[0].ocupados} ocupados` : "Sin ocupación",
    },
    {
      titulo: "Cancelaciones",
      valor: inscripciones.filter((i) => Number(i.estado) === 4).length,
      nota: "último período",
    },
  ];

  return (
    <div className="clases-metricas-grid">
      {metricas.map((meta) => (
        <div key={meta.titulo} className="clases-metric-card">
          <span>{meta.titulo}</span>
          <strong>{meta.valor}</strong>
          <small>{meta.nota}</small>
        </div>
      ))}
    </div>
  );
}

export default ClasesMetricasPanel;
