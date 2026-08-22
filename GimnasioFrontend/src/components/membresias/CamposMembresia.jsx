// =========================================================
// CAMPOS DEL FORMULARIO DE MEMBRESÍA
// Selector de plan y duración, y campo de solo lectura.
// Piezas presentacionales reutilizables del dominio.
// =========================================================

export function SelectorPlan({
  planSeleccionado,
  setPlanSeleccionado,
  planes,
  cargandoPlanes,
  errorPlanes,
  recalcularFechas,
}) {
  return (
    <div className="input-group">
      <label>Plan</label>

      <select
        value={planSeleccionado}
        onChange={(e) => {
          setPlanSeleccionado(e.target.value);
          recalcularFechas();
        }}
        required
        disabled={cargandoPlanes}
      >
        <option value="">
          {cargandoPlanes ? "Cargando planes..." : "Seleccionar plan"}
        </option>

        {planes.map((plan) => (
          <option key={plan.id} value={plan.id}>{plan.nombre}</option>
        ))}
      </select>

      {errorPlanes && (
        <small className="error-message">{errorPlanes}</small>
      )}
    </div>
  );
}

export function SelectorDuracion({ duracionMembresia, alCambiar }) {
  const opciones = ["1", "3", "6", "12"];
  const textos = {
    "1": "1 mes",
    "3": "3 meses",
    "6": "6 meses",
    "12": "12 meses",
  };

  return (
    <div className="input-group">
      <label>Duración</label>

      <select
        value={duracionMembresia}
        onChange={(e) => alCambiar(e.target.value)}
        required
      >
        <option value="">Seleccionar duración</option>

        {opciones.map((op) => (
          <option key={op} value={op}>{textos[op]}</option>
        ))}
      </select>
    </div>
  );
}

export function CampoSoloLectura({ label, valor, tipo = "text" }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={tipo} value={valor} readOnly />
    </div>
  );
}
