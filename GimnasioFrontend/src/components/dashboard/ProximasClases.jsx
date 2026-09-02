// ProximasClases — Horarios de hoy con su clase y cupo.
export default function ProximasClases({
  horariosDelDia = [],
  clases = [],
  inscripciones = [],
  onVer,
}) {
  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Clases de hoy</h3>
        <span className="panel-inicio-contador">{horariosDelDia.length}</span>
      </div>

      {horariosDelDia.length === 0 ? (
        <p className="panel-inicio-vacio">Sin clases programadas hoy.</p>
      ) : (
        <ul className="alerta-lista">
          {horariosDelDia.map((h) => {
            const clase = clases.find((c) => Number(c.id) === Number(h.claseId));
            const ocupados = inscripciones.filter(
              (i) =>
                Number(i.horarioClaseId) === Number(h.id) &&
                Number(i.estado) !== 4
            ).length;

            return (
              <li key={h.id} className="alerta-item">
                <div>
                  <span className="alerta-nombre">{clase?.nombre ?? "Clase"}</span>
                  <span className="alerta-sub">
                    {h.horaInicio} hs · {ocupados} inscriptos
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="panel-inicio-pie" onClick={onVer}>
        Ver asistencias
      </button>
    </div>
  );
}
