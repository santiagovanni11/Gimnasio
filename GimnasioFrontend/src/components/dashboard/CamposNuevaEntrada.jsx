import { useState } from "react";

export default function CamposNuevaEntrada({
  titulo,
  placeholder,
  etiquetaBoton,
  creando = false,
  onCrear,
}) {
  const [texto, setTexto] = useState("");

  const crear = () => {
    if (!texto.trim()) return;
    onCrear(texto);
    setTexto("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <div className="input-group" style={{ flex: "1 1 240px", marginBottom: 0 }}>
        <label>{titulo}</label>
        <input
          type="text"
          placeholder={placeholder}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              crear();
            }
          }}
        />
      </div>

      <button
        type="button"
        className="primary-small-button"
        disabled={creando}
        onClick={crear}
      >
        {creando ? "Agregando..." : etiquetaBoton}
      </button>
    </div>
  );
}
