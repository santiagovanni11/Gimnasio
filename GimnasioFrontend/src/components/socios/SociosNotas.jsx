import { useEffect, useState } from "react";
import {
  agregarNotaSocio,
  obtenerMetaSocio,
  registrarCambioSocio,
} from "../../utils/sociosMetadata";

function SociosNotas({ socioId }) {
  const [notas, setNotas] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    setNotas(obtenerMetaSocio(socioId).notas);
  }, [socioId]);

  const guardarNota = () => {
    const valor = texto.trim();
    if (!valor) return;

    const lista = agregarNotaSocio(socioId, valor, "Tu sesión");
    registrarCambioSocio(socioId, "Nota interna", valor, "Tu sesión");
    setNotas(lista);
    setTexto("");
  };

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
      <h4 style={{ marginBottom: "0.75rem" }}>Notas internas</h4>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        placeholder="Ej: falta pagar, solicita masajes, horario preferido..."
        style={{ width: "100%", resize: "vertical", borderRadius: "8px", padding: "0.75rem" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <button type="button" className="primary-small-button" onClick={guardarNota}>
          Guardar nota
        </button>
      </div>

      {notas.length === 0 ? (
        <p style={{ marginTop: "0.75rem", color: "#6b7280" }}>Sin notas internas por ahora.</p>
      ) : (
        <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1rem" }}>
          {notas.slice(0, 5).map((nota) => (
            <li key={nota.id} style={{ marginBottom: "0.5rem" }}>
              <strong>{new Date(nota.fecha).toLocaleDateString("es-AR")}</strong> — {nota.texto}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SociosNotas;
