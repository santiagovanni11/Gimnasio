/* SelectorBeneficiosClases - Checklist de beneficios y clases */

export default function SelectorBeneficiosClases({
  beneficios = [],
  clases = [],
  seleccionB = [],
  seleccionC = [],
  onToggleB,
  onToggleC,
}) {
  const mensajeVacio = (titulo) =>
    titulo === "Beneficios incluidos"
      ? "No hay beneficios en el catálogo. Podés crear uno en el campo de arriba."
      : "No hay clases en el catálogo. Creá una clase para poder sumarla a este plan.";

  const renderGrupo = (titulo, items, seleccion, onToggle) => (
    <div className="selector-grupo">
      <h4>{titulo}</h4>

      {items.length === 0 ? (
        <small className="info-message">{mensajeVacio(titulo)}</small>
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

  return (    <div className="selector-beneficios-clases">
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
