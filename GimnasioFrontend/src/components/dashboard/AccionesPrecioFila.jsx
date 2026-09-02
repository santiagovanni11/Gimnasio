/* AccionesPrecioFila - Botonera de acciones por plan */

/** Botonera por plan. En edición se oculta: las acciones de
 * guardado viven en el panel expandible (EditorPreciosPanel). */
function AccionesPrecio({
  plan,
  enEdicion,
  onEditar,
  onAlternarEstado,
  onDuplicar,
  onVerHistorial,
  onEliminar,
  onEditarBeneficios,
}) {
  if (enEdicion) {
    return (
      <span className="status-warning">Editando...</span>
    );
  }

  return (
    <div className="table-actions">
      <button
        type="button"
        className="edit-button"
        onClick={() => onEditar(plan)}
        title="Editar precios del escalón"
      >
        Editar
      </button>

      {onAlternarEstado && (
        <button
          type="button"
          className={
            plan.activo === false ? "approve-button" : "cancel-button"
          }
          onClick={() => onAlternarEstado(plan)}
          title={
            plan.activo === false
              ? "Reactivar la venta de este plan"
              : "Dejar de vender este plan (no se borra)"
          }
        >
          {plan.activo === false ? "Reactivar" : "Pausar"}
        </button>
      )}

      {onDuplicar && (
        <button
          type="button"
          className="view-button"
          onClick={() => onDuplicar(plan)}
          title="Crear una copia para editar precios"
        >
          Duplicar
        </button>
      )}

      {onVerHistorial && (
        <button
          type="button"
          className="view-button"
          onClick={() => onVerHistorial(plan)}
          title="Ver cambios de precio"
        >
          Historial
        </button>
      )}

      {onEditarBeneficios && (
        <button
          type="button"
          className="view-button"
          onClick={() => onEditarBeneficios(plan)}
          title="Beneficios y clases incluidos"
        >
          Benef/Clases
        </button>
      )}

      {onEliminar && (
        <button
          type="button"
          className="delete-button"
          onClick={() => onEliminar(plan)}
          title="Eliminación definitiva (solo sin membresías asociadas)"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

export default AccionesPrecio;
