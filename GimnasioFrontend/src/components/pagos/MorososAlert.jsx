import { useEffect, useMemo, useState } from "react";
import { dialogoSistema } from "../../services/servicioDialogos";
import { formatoMoneda } from "../../utils/pagos";

/**
 * Alerta de socios con saldo pendiente.
 * Se muestra solo cuando existen morosos.
 */
export default function MorososAlert({ morosos = [], onCancelarPendientes }) {
  const [seleccionados, setSeleccionados] = useState([]);
  const [removidos, setRemovidos] = useState([]);

  const idsRemovidos = useMemo(
    () => new Set(removidos.map((id) => Number(id))),
    [removidos]
  );

  const listaVisible = useMemo(
    () => morosos.filter((m) => !idsRemovidos.has(Number(m.id))),
    [morosos, idsRemovidos]
  );

  useEffect(() => {
    setRemovidos((prev) =>
      prev.filter((id) => morosos.some((m) => Number(m.id) === Number(id)))
    );
  }, [morosos]);

  const idsSeleccionados = useMemo(
    () => new Set(seleccionados.map((id) => Number(id))),
    [seleccionados]
  );

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) => {
      const numero = Number(id);
      return prev.includes(numero)
        ? prev.filter((item) => item !== numero)
        : [...prev, numero];
    });
  };

  const cancelarSeleccionados = async () => {
    if (!seleccionados.length || !onCancelarPendientes) return;

    const seleccion = listaVisible.filter((m) => idsSeleccionados.has(Number(m.id)));
    if (!seleccion.length) return;

    const aceptado = await dialogoSistema.confirmar({
      titulo: "Cancelar pendientes",
      mensaje: `¿Cancelar ${seleccion.length} membresía${seleccion.length !== 1 ? "s" : ""} seleccionada${seleccion.length !== 1 ? "s" : ""}? Esto deja el historial y elimina el pendiente actual.`,
      textoAceptar: "Cancelar pendientes",
      tono: "peligro",
    });

    if (!aceptado) return;

    for (const miembro of seleccion) {
      await onCancelarPendientes(miembro, { confirmar: false });
    }

    setRemovidos((prev) => [
      ...prev,
      ...seleccion.map((m) => Number(m.id)),
    ]);
    setSeleccionados([]);
  };

  if (!listaVisible.length) {
    return null;
  }

  return (
    <section className="content-card morosos-alert">
      <div className="section-header">
        <div>
          <h3>Socios con saldo pendiente</h3>
          <p>
            {listaVisible.length} membresía{listaVisible.length !== 1 ? "s" : ""} con
            cobro incompleto.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={cancelarSeleccionados}
          disabled={!seleccionados.length || !onCancelarPendientes}
        >
          Cancelar pendientes
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 42 }}>
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos los pendientes"
                  checked={
                    listaVisible.length > 0 &&
                    listaVisible.every((m) => idsSeleccionados.has(Number(m.id)))
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSeleccionados(listaVisible.map((m) => Number(m.id)));
                      return;
                    }
                    setSeleccionados([]);
                  }}
                />
              </th>
              <th>Socio</th>
              <th>Plan</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Vence</th>
            </tr>
          </thead>

          <tbody>
            {listaVisible.map((m) => (
              <tr key={m.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={idsSeleccionados.has(Number(m.id))}
                    onChange={() => toggleSeleccion(m.id)}
                    aria-label={`Seleccionar ${m.socioNombre} ${m.socioApellido}`}
                  />
                </td>
                <td>
                  {m.socioNombre} {m.socioApellido}
                </td>
                <td>{m.planNombre}</td>
                <td>{formatoMoneda(m.pagado)}</td>
                <td>
                  <span className="status-warning">
                    {formatoMoneda(m.saldo)}
                  </span>
                </td>
                <td>
                  {m.fechaFin
                    ? new Date(m.fechaFin).toLocaleDateString("es-AR")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
