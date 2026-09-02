import { useEffect, useState } from "react";
import { obtenerMetaSocio } from "../../utils/sociosMetadata";

function SociosHistorial({ socioId }) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    setHistorial(obtenerMetaSocio(socioId).historial);
  }, [socioId]);

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
      <h4 style={{ marginBottom: "0.75rem" }}>Historial de cambios</h4>
      {historial.length === 0 ? (
        <p style={{ color: "#6b7280" }}>Todavía no hubo cambios registrados.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          {historial.slice(0, 6).map((item) => (
            <li key={item.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{new Date(item.fecha).toLocaleString("es-AR")}</strong> — {item.accion}
              {item.detalle ? `: ${item.detalle}` : ""}
              {item.autor ? ` (${item.autor})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SociosHistorial;
