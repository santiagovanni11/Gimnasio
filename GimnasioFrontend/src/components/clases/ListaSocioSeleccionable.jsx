// =========================================================
// LISTA DE SOCIOS SELECCIONABLES — Inscripción masiva
// Buscador por nombre/apellido/DNI + checkboxes. Excluye
// socios inactivos, sin acceso a clases o ya inscriptos al
// horario de destino. Muestra el resumen de la selección.
// =========================================================

import { useState } from "react";

function ListaSocioSeleccionable({
  socios = [],
  ocupadosIds,
  seleccionIds,
  alternarSocio,
}) {
  const [busqueda, setBusqueda] = useState("");

  const texto = busqueda.trim().toLowerCase();

  const elegibles = socios.filter(
    (s) =>
      s.activo !== false &&
      !s.sinAccesoAClases &&
      !ocupadosIds.has(Number(s.id)) &&
      (!texto ||
        [s.nombre, s.apellido, s.dni]
          .filter(Boolean)
          .some((v) =>
            String(v).toLowerCase().includes(texto)))
  );

  return (
    <>
      <div className="input-group">
        <label>Buscar socios</label>
        <input type="search" value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Nombre, apellido o DNI…"
          autoFocus />
      </div>

      <div className="inscripcion-masiva-lista">
        {elegibles.length === 0 ? (
          <small className="error-message">
            No hay socios disponibles con los filtros actuales.
          </small>
        ) : (
          elegibles.map((socio) => {
            const id = Number(socio.id);
            const marcado = seleccionIds.includes(id);

            return (
              <label key={socio.id}
                className={
                  "inscripcion-masiva-fila" +
                  (marcado ? " seleccionada" : "")
                }>
                <input type="checkbox" checked={marcado}
                  onChange={() => alternarSocio(id)} />
                <span>
                  {socio.nombre} {socio.apellido}{" "}
                  {socio.dni ? `· DNI ${socio.dni}` : ""}
                </span>
              </label>
            );
          })
        )}
      </div>

      <p className="inscripcion-masiva-resumen">
        {seleccionIds.length}{" "}
        {seleccionIds.length === 1
          ? "socio seleccionado"
          : "socios seleccionados"}
      </p>
    </>
  );
}

export default ListaSocioSeleccionable;