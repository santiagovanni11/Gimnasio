// =========================================================
// CHIP DE CUPO
// Muestra "ocupados/capacidad" y avisa cuando se completó.
// =========================================================

function CupoChip({ ocupados, capacidad }) {
  const lleno = Number(ocupados) >= Number(capacidad);

  return (
    <span className={lleno ? "status-warning" : "status-active"}>
      {ocupados}/{capacidad}
      {lleno && " · completo"}
    </span>
  );
}

export default CupoChip;
