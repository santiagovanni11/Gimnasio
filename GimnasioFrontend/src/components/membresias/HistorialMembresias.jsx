import { obtenerEventosMembresia } from "../../utils/membresiasMetadata";

function HistorialMembresias({ membresiaId }) {
  const eventos = obtenerEventosMembresia(membresiaId);
  if (!eventos.length) return <p className="dialogo-mensaje">Sin historial de renovación para esta membresía.</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>Historial de renovaciones</h4>
      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
        {eventos.map((evento) => (
          <li key={`${evento.id}-${evento.accion}`} style={{ marginBottom: "0.5rem" }}>
            <strong>{new Date(evento.fecha).toLocaleString("es-AR")}</strong> — {evento.accion}: {evento.detalle} ({evento.usuario})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistorialMembresias;
