// InscritosHoy — Socios anotados a las clases de hoy.
export default function InscritosHoy({ porClase = [] }) {
  const total = porClase.reduce((acc, f) => acc + f.socios.length, 0);

  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Inscritos hoy</h3>
        <span className="panel-inicio-contador">{total}</span>
      </div>

      {porClase.length === 0 ? (
        <p className="panel-inicio-vacio">Sin inscripciones para hoy.</p>
      ) : (
        <ul className="alerta-lista">
          {porClase.slice(0, 3).map((f, i) => (
            <li key={i} className="alerta-item">
              <div>
                <span className="alerta-nombre">{f.clase} · {f.hora}</span>
                <span className="alerta-sub">{f.socios.join(", ")}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
