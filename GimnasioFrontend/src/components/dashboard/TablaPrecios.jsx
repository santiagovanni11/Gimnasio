// =========================================================
// TABLA DE PRECIOS — Grilla editable del escalón por plan
// Validación por celda, equivalente mensual y panel expandible
// de edición (vigencia + guardado).
// =========================================================

import { Fragment } from "react";
import { CAMPOS_ESCALON } from "../../utils/preciosConfig";
import { PrecioInput } from "./PrecioFila";
import AccionesPrecioFila from "./AccionesPrecioFila";
import EditorPreciosPanel from "./EditorPreciosPanel";

function TablaPrecios({
  planes,
  preciosEditando,
  setPreciosEditando,
  planEditando,
  guardandoPrecios,
  guardarPreciosPlan,
  cancelarEdicionPrecios,
  validarCelda,
  fechaRige,
  setFechaRige,
  onAlternarEstado,
  onDuplicar,
  onVerHistorial,
  onEliminar,
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Plan</th>

            {CAMPOS_ESCALON.map(({ clave, titulo }) => (
              <th key={clave}>{titulo}</th>
            ))}

            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {planes.map((plan) => {
            const enEdicion = planEditando === plan.id;

            return (
              <Fragment key={plan.id}>
                <tr>
                  <td>
                    <strong>{plan.nombre}</strong>

                    <div>
                      <span
                        className={
                          plan.activo === false
                            ? "status-inactive"
                            : "status-active"
                        }
                      >
                        {plan.activo === false ? "Pausado" : "Activo"}
                      </span>
                    </div>
                  </td>

                  {CAMPOS_ESCALON.map(({ clave, meses }) => (
                    <PrecioInput
                      key={clave}
                      plan={plan}
                      campo={clave}
                      meses={meses}
                      valores={preciosEditando[plan.id] ?? {}}
                      preciosEditando={preciosEditando}
                      setPreciosEditando={setPreciosEditando}
                      enEdicion={enEdicion}
                      validarCelda={validarCelda}
                    />
                  ))}

                  <td>
                    <AccionesPrecioFila
                      plan={plan}
                      enEdicion={enEdicion}
                      onEditar={(p) => cancelarEdicionPrecios(true, p.id)}
                      onAlternarEstado={onAlternarEstado}
                      onDuplicar={onDuplicar}
                      onVerHistorial={onVerHistorial}
                      onEliminar={onEliminar}
                    />
                  </td>
                </tr>

                {enEdicion && (
                  <EditorPreciosPanel
                    plan={plan}
                    fechaRige={fechaRige}
                    setFechaRige={setFechaRige}
                    guardandoPrecios={guardandoPrecios}
                    guardarPreciosPlan={guardarPreciosPlan}
                    cancelarEdicionPrecios={cancelarEdicionPrecios}
                  />
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPrecios;
