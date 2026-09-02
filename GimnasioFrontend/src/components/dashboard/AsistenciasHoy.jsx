// AsistenciasHoy — Ingresos del día con nombres de presentes.
export default function AsistenciasHoy({
  asistenciasHoy = [],
  inscripciones = [],
  onVer,
}) {
  const presentes = asistenciasHoy
    .filter((a) => a.presente === true)
    .map((a) => {
      const ins = inscripciones.find(
        (i) => Number(i.id) === Number(a.inscripcionClaseId)
      );
      return ins ? `${ins.socioNombre} ${ins.socioApellido}` : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Asistencias de hoy</h3>
        <span className="panel-inicio-contador">{asistenciasHoy.length}</span>
      </div>

      {presentes.length === 0 ? (
        <p className="panel-inicio-vacio">Todavía no hay ingresos registrados.</p>
      ) : (
        <ul className="alerta-lista">
          {presentes.map((nombre, i) => (
            <li key={i} className="alerta-item">
              <span className="alerta-nombre">{nombre}</span>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="panel-inicio-pie" onClick={onVer}>
        Ver asistencias
      </button>
    </div>
  );
}
