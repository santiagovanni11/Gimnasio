// TopClases — Clases de hoy con más inscriptos (ranking en barras).
export default function TopClases({ clases = [] }) {
  const total = clases[0]?.cantidad || 1;

  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Top clases de hoy</h3>
        <span className="panel-inicio-contador">
          {clases.reduce((acc, c) => acc + c.cantidad, 0)}
        </span>
      </div>

      {clases.length === 0 ? (
        <p className="panel-inicio-vacio">Sin inscriptos todavía.</p>
      ) : (
        <ul className="plan-barras">
          {clases.map((c) => (
            <li key={c.id} className="plan-barra">
              <div className="plan-barra-cabecera">
                <span>{c.nombre} · {c.hora}</span>
                <span>{c.cantidad}</span>
              </div>
              <div className="plan-barra-pista">
                <div
                  className="plan-barra-relleno"
                  style={{ width: `${Math.round((c.cantidad / total) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
