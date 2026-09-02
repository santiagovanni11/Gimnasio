// =========================================================
// SELECTOR DE FECHA DE ASISTENCIA
// Navegación día a día + atajo "Hoy". Input date nativo.
// =========================================================

import { hoyISO } from "../../utils/fechas";

function SelectorFecha({ fecha, setFecha }) {
  const mover = (dias) => {
    const base = new Date(`${fecha}T12:00:00`);
    base.setDate(base.getDate() + dias);

    const dia = String(base.getDate()).padStart(2, "0");
    const mes = String(base.getMonth() + 1).padStart(2, "0");

    setFecha(`${base.getFullYear()}-${mes}-${dia}`);
  };

  return (
    <div className="section-actions selector-fecha">
      <button type="button" className="secondary-button"
        onClick={() => mover(-1)}
        title="Día anterior">
        ◀
      </button>

      <input type="date" value={fecha}
        onChange={(e) => setFecha(e.target.value)} />

      <button type="button" className="secondary-button"
        onClick={() => mover(1)}
        title="Día siguiente">
        ▶
      </button>

      {fecha !== hoyISO() && (
        <button type="button" className="quick-range-button"
          style={{ cursor: "pointer" }}
          onClick={() => setFecha(hoyISO())}>
          Volver a hoy
        </button>
      )}
    </div>
  );
}

export default SelectorFecha;
