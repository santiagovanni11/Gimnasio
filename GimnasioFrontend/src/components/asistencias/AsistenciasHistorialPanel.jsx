// =========================================================
// HISTORIAL DE ASISTENCIAS
// Últimos cambios de marca con contexto de clase y horario.
// Usa los campos denormalizados del DTO de asistencia para
// no depender de cadenas de lookup inscripción→horario→clase.
// =========================================================

import { estadoInscripcionTexto } from "../../utils/inscripcionesClase";

const formatearFecha = (valor) => {
  if (!valor) return "-";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function AsistenciasHistorialPanel({
  asistencias = [],
  inscripciones = [],
}) {
  const inscripcionesPorId = new Map(
    inscripciones.map((i) => [Number(i.id), i])
  );

  const filas = [...asistencias]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 6)
    .map((marca) => ({
      ...marca,
      inscripcion: inscripcionesPorId.get(
        Number(marca.inscripcionClaseId)
      ),
    }));

  return (
    <section className="content-card" style={{ padding: 16, marginBottom: 16 }}>
      <div className="section-header">
        <div>
          <h3 style={{ margin: 0 }}>Historial y auditoría</h3>
          <p style={{ margin: "6px 0 0" }}>
            Últimos cambios de asistencia para revisión operativa.
          </p>
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="empty-state">Sin movimientos recientes.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Clase</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.id ?? `${fila.inscripcionClaseId}-${fila.fecha}`}>
                  <td>
                    {fila.socioNombre || "-"} {fila.socioApellido || ""}
                  </td>
                  <td>
                    {fila.claseNombre || "Clase"}
                    {fila.horaInicio && (
                      <span style={{ color: "#8b929c", fontSize: 12 }}>
                        {" · "}
                        {String(fila.horaInicio).slice(0, 5)} a{" "}
                        {String(fila.horaFin).slice(0, 5)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={fila.presente ? "status-active" : "status-rejected"}>
                      {fila.presente ? "Presente" : "Ausente"}
                    </span>
                  </td>
                  <td>
                    {formatearFecha(fila.fecha)}
                    <div style={{ color: "#8b929c", fontSize: 12 }}>
                      {estadoInscripcionTexto(fila.inscripcion?.estado ?? 0)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AsistenciasHistorialPanel;
