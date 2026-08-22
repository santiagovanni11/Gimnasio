// =========================================================
// SELECTOR DE SOCIO CON AVISO
// Detecta si el socio ya tiene una membresía activa o
// pendiente y notifica al padre junto con la selección.
// =========================================================

function SelectorSocioConAviso({
  socios,
  value,
  onSelect,
  membresias,
  membresiasRechazadasIds,
  mostrarAviso,
}) {
  const seleccionar = (socioId) => {
    const existente = socioId
      ? membresias.find(
          (m) =>
            m.socioId === Number(socioId) &&
            (m.estado === 1 || m.estado === 2) &&
            !membresiasRechazadasIds?.has(Number(m.id))
        )
      : null;

    onSelect(socioId, existente ?? null);
  };

  return (
    <>
      <select
        value={value}
        onChange={(e) => seleccionar(e.target.value)}
        required
      >
        <option value="">Seleccionar socio</option>

        {socios.map((socio) => (
          <option key={socio.id} value={socio.id}>
            {socio.nombre} {socio.apellido}
          </option>
        ))}
      </select>

      {mostrarAviso && (
        <small className="error-message">
          Este socio ya tiene una membresía activa o pendiente.
        </small>
      )}
    </>
  );
}

export default SelectorSocioConAviso;
