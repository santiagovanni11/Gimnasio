// =========================================================
// BARRA DE RENOVACIÓN MASIVA
// Aparece cuando hay membresías marcadas en la tabla.
// =========================================================

function RenovacionMasivaBarra({ cantidad, onRenovar, onLimpiar }) {
  if (!cantidad) return null;

  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        gap: "0.75rem", margin: "0.75rem 0",
      }}
    >
      <small style={{ color: "var(--texto-muted)" }}>
        Las casillas marcadas se utilizan para renovar varias membresías a la vez.
      </small>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="primary-small-button"
          onClick={onRenovar}
        >
          Renovar seleccionadas ({cantidad})
        </button>
        <button type="button" className="secondary-button" onClick={onLimpiar}>
          Limpiar selección
        </button>
      </div>
    </div>
  );
}

export default RenovacionMasivaBarra;
