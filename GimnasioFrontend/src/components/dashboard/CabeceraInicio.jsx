// CabeceraInicio — Título del resumen con hora de última
// actualización y botón de refresco manual.
import { useState } from "react";

export default function CabeceraInicio({ onRefrescar }) {
  const [refrescado, setRefrescado] = useState(null);

  const refrescar = async () => {
    await onRefrescar?.();
    setRefrescado(new Date());
  };

  const hora = refrescado
    ? refrescado.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="inicio-titulo">
      <h2>Resumen de hoy</h2>
      <span>Indicadores en tiempo real</span>
      <span className="alerta-sub">Actualizado {hora}</span>
      <button type="button" className="link-button" onClick={refrescar}>
        Refrescar
      </button>
    </div>
  );
}
