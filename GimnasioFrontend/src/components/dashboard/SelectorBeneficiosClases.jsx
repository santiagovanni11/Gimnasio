/* SelectorBeneficiosClases - Checklist de beneficios y clases */

export default function SelectorBeneficiosClases({
  beneficios = [],
  clases = [],
  seleccionB = [],
  seleccionC = [],
  onToggleB,
  onToggleC,
}) {
  const renderGrupo = (titulo, items, seleccion, onToggle) => (
    <div className="selector-grupo">
      <h4>{titulo}</h4>

      {items.length === 0 ? (
        <small className="info-message">No hay opciones disponibles.</small>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="selector-beneficios-clases">
      {renderGrupo(
        "Beneficios incluidos",
        beneficios,
        seleccionB,
        onToggleB
      )}
      {renderGrupo("Clases incluidas", clases, seleccionC, onToggleC)}
    </div>
  );
}
