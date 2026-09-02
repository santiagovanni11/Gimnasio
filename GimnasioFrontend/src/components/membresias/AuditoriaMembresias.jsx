import { obtenerEventosMembresia } from "../../utils/membresiasMetadata";

function AuditoriaMembresias({ membresias }) {
  const eventos = membresias
    .flatMap((m) => obtenerEventosMembresia(m.id).map((e) => ({ ...e, socio: `${m.socioNombre} ${m.socioApellido}` })))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 8);

  return (
    <div className="content-card" style={{ marginTop: "1rem" }}>
      <h4>Auditoría simple</h4>
      {eventos.length === 0 ? (
        <p className="dialogo-mensaje">Sin cambios registrados todavía.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {eventos.map((evento) => (
            <li key={`${evento.id}-${evento.accion}`} style={{ marginBottom: "0.5rem" }}>
              <strong>{new Date(evento.fecha).toLocaleString("es-AR")}</strong> — {evento.accion}: {evento.detalle} ({evento.usuario})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AuditoriaMembresias;
