// =========================================================
// ACCIONES DE FILA DE SOCIO
// Editar, renovar membresía, ficha y baja/alta lógica. La
// baja nunca es física: solo desactiva/reactiva.
// =========================================================

/** Merece renovación: sin membresía, vencida o rechazada. */
const necesitaRenovacion = (socio, rechazadasIds) =>
  !socio.membresia ||
  socio.membresia.estado !== "Vigente" ||
  rechazadasIds?.has(Number(socio.membresia.id));

function AccionesSocio({
  socio,
  puedeEditarSocios,
  puedeCrearSocios,
  editarSocio,
  alternarEstadoSocio,
  abrirFormularioMembresiaDesdeSocio,
  verFicha,
  inscribirEnClases,
  membresiasRechazadasIds,
}) {
  return (
    <>
      {puedeEditarSocios && (
        <button
          type="button"
          className="edit-button"
          onClick={() => editarSocio(socio)}
        >
          Editar
        </button>
      )}

      {puedeCrearSocios && necesitaRenovacion(socio, membresiasRechazadasIds) && (
        <button
          type="button"
          className="approve-button"
          onClick={() => abrirFormularioMembresiaDesdeSocio(socio.id)}
          title="Asignar nueva membresía"
        >
          Renovar
        </button>
      )}

      {puedeCrearSocios && socio.activo !== false && !socio.sinAccesoAClases && (
        <button
          type="button"
          className="view-button"
          onClick={() => inscribirEnClases?.(socio)}
          title="Inscribir a clases del gimnasio"
        >
          Clases
        </button>
      )}

      <button
        type="button"
        className="view-button"
        onClick={() => verFicha(socio)}
        title="Ver ficha completa"
      >
        Ficha
      </button>

      {puedeEditarSocios && (
        <button
          type="button"
          className={socio.activo === false ? "approve-button" : "cancel-button"}
          onClick={() => alternarEstadoSocio(socio)}
          title={
            socio.activo === false
              ? "Reactivar socio"
              : "Desactivar socio"
          }
        >
          {socio.activo === false ? "Activar" : "Desactivar"}
        </button>
      )}
    </>
  );
}

export default AccionesSocio;
