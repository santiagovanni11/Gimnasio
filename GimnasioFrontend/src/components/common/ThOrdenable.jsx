// =========================================================
// TH ORDENABLE — Encabezado de tabla clickeable
// =========================================================

function ThOrdenable({ campo, texto, activo, asc, onOrdenar }) {
  return (
    <th
      onClick={() => onOrdenar(campo)}
      style={{ cursor: "pointer", userSelect: "none" }}
      title="Ordenar"
    >
      {texto}
      {activo ? (asc ? " ▲" : " ▼") : ""}
    </th>
  );
}

export default ThOrdenable;
