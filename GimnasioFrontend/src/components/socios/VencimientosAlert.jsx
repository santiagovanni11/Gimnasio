/**
 * Alerta de membresías por vencer (faltan `dias` días).
 * Muestra el teléfono para contactar al socio directo.
 */
export default function VencimientosAlert({
  vencimientos = [],
  socios = [],
  dias = 4,
}) {
  if (!vencimientos.length) {
    return null;
  }

  const telefonoDe = (membresia) => {
    const socio = socios.find(
      (s) => Number(s.id) === Number(membresia.socioId)
    );
    return socio?.telefono || "-";
  };

  return (
    <div className="form-card" style={{ marginBottom: "1rem", borderLeft: "4px solid #fbbf24" }}>
      <div className="form-card-header">
        <div>
          <h3>Vencen en {dias} días</h3>
          <p>
            {vencimientos.length} membresía{vencimientos.length !== 1 ? "s" : ""}{" "}
            por vencer. Contactá al socio para renovar.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Socio</th>
              <th>Teléfono</th>
              <th>Plan</th>
              <th>Vence</th>
            </tr>
          </thead>

          <tbody>
            {vencimientos.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.socioNombre} {m.socioApellido}
                </td>
                <td>{telefonoDe(m)}</td>
                <td>{m.planNombre}</td>
                <td>
                  <span className="status-warning">
                    {new Date(m.fechaFin).toLocaleDateString("es-AR")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
