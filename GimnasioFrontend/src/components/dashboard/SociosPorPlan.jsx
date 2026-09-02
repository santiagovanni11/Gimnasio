// SociosPorPlan — Distribución de membresías por plan.
// Cuenta membresías activas o pendientes (socios inscriptos en un
// plan). Excluye vencidas/suspendidas/canceladas y las rechazadas
// del período, igual que el resto de la app.
export default function SociosPorPlan({ membresias = [], rechazadasIds = null }) {
  const activas = membresias.filter(
    (m) =>
      (Number(m.estado) === 1 || Number(m.estado) === 2) &&
      !(rechazadasIds && rechazadasIds.has(Number(m.id)))
  );
  const conteo = {};

  activas.forEach((m) => {
    const nombre = m.planNombre || "Sin plan";
    conteo[nombre] = (conteo[nombre] || 0) + 1;
  });

  const total = activas.length || 1;
  const filas = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Socios por plan</h3>
        <span className="panel-inicio-contador">{activas.length}</span>
      </div>

      {filas.length === 0 ? (
        <p className="panel-inicio-vacio">Sin socios con membresía.</p>
      ) : (
        <ul className="plan-barras">
          {filas.map(([nombre, cantidad]) => (
            <li key={nombre} className="plan-barra">
              <div className="plan-barra-cabecera">
                <span>{nombre}</span>
                <span>{cantidad}</span>
              </div>
              <div className="plan-barra-pista">
                <div
                  className="plan-barra-relleno"
                  style={{ width: `${Math.round((cantidad / total) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
