/* SelectorBeneficiosClases - Checklist de beneficios y clases */
/* Cada grupo se muestra en su propia tarjeta para evitar
   superposición cuando no hay beneficios o clases.
   Los beneficios del catálogo tienen botón "Borrar". */

export default function SelectorBeneficiosClases({
  beneficios = [],
  clases = [],
  seleccionB = [],
  seleccionC = [],
  onToggleB,
  onToggleC,
  onEliminarBeneficio,
  eliminandoBeneficioId,
}) {
  const renderGrupo = (titulo, items, seleccion, onToggle) => (
    <div className="selector-grupo">
      <h4>{titulo}</h4>

      {items.length === 0 ? (
        <p className="selector-vacio">Sin {titulo.toLowerCase()}</p>
      ) : (
        <ul className="selector-lista">
          {items.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={seleccion.includes(item.id)}
                  onChange={() => onToggle?.(item.id)}
                />
                {item.nombre}
              </label>
              {titulo === "Beneficios incluidos" && (
                <button
                  type="button"
                  className="btn-borrar-item"
                  title="Borrar beneficio"
                  onClick={() => onEliminarBeneficio?.(item.id)}
                  disabled={
                    eliminandoBeneficioId === item.id
                  }
                >
                  {eliminandoBeneficioId === item.id
                    ? "Borrando..."
                    : "Borrar"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="selector-beneficios-clases">
      {renderGrupo("Beneficios incluidos", beneficios, seleccionB, onToggleB)}
      {renderGrupo("Clases incluidas", clases, seleccionC, onToggleC)}
    </div>
  );
}
