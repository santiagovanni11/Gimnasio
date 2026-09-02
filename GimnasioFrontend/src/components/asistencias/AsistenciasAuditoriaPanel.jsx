// =========================================================
// AUDITORÍA OPERATIVA DE ASISTENCIAS
// Muestra último cambio, quién lo hizo y cuándo, sin
// depender de un backend de auditoría completo.
// =========================================================

const formatearFecha = (valor) => {
  if (!valor) return "-";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function AsistenciasAuditoriaPanel({ asistencias = [] }) {
  const filas = [...asistencias]
    .filter((a) => a?.fechaModificacion || a?.registradoPor)
    .sort((a, b) => new Date(b.fechaModificacion ?? b.fecha) - new Date(a.fechaModificacion ?? a.fecha))
    .slice(0, 5);

  return (
    <section className="content-card" style={{ padding: 16, marginBottom: 16 }}>
      <div className="section-header">
        <div>
          <h3 style={{ margin: 0 }}>Auditoría de asistencias</h3>
          <p style={{ margin: "6px 0 0" }}>
            Quién marcó, modificó y cuándo.
          </p>
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="empty-state">Sin auditoría disponible.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Registro</th>
                <th>Socio</th>
                <th>Clase</th>
                <th>Usuario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={`${fila.id ?? fila.inscripcionClaseId}-${fila.fechaModificacion ?? fila.fecha}`}>
                  <td>
                    <span className={fila.presente ? "status-active" : "status-rejected"}>
                      {fila.presente ? "Presente" : "Ausente"}
                    </span>
                  </td>
                  <td>{fila.socioNombre} {fila.socioApellido}</td>
                  <td>{fila.claseNombre || "-"}</td>
                  <td>{fila.registradoPor || "Sistema"}</td>
                  <td>{formatearFecha(fila.fechaModificacion || fila.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AsistenciasAuditoriaPanel;
