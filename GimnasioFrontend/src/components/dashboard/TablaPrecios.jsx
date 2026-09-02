// =========================================================
// TABLA DE PRECIOS — Grilla editable del escalón por plan
// Validación por celda, equivalente mensual y panel expandible
// de edición (vigencia + guardado).
// =========================================================

import { Fragment } from "react";
import {
  CAMPOS_ESCALON,
  clavesIncompletas,
} from "../../utils/preciosConfig";
import { PrecioInput } from "./PrecioFila";
import AccionesPrecioFila from "./AccionesPrecioFila";
import EditorPreciosPanel from "./EditorPreciosPanel";

function TablaPrecios({
  planes,
  membresias,
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
  onEditarBeneficios,
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

            <th>Beneficios</th>
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

                      {clavesIncompletas(plan).length > 0 && (
                        <span
                          className="status-warning"
                          title="Hay períodos sin precio definido (0 o vacío)"
                        >
                          Incompleto
                        </span>
                      )}
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
                    {plan.clases?.length > 0 && (
                      <span className="status-active">{plan.clases.length} clases</span>
                    )}{" "}
                    {plan.beneficios?.length > 0 && (
                      <span className="status-warning">{plan.beneficios.length} benef.</span>
                    )}
                    {!(plan.clases?.length > 0 || plan.beneficios?.length > 0) && "—"}
                  </td>

                  <td>
                    <AccionesPrecioFila
                      plan={plan}
                      enEdicion={enEdicion}
                      onEditar={(p) => cancelarEdicionPrecios(true, p.id)}
                      onAlternarEstado={onAlternarEstado}
                      onDuplicar={onDuplicar}
                      onVerHistorial={onVerHistorial}
                      onEliminar={onEliminar}
                      onEditarBeneficios={onEditarBeneficios}
                    />
                  </td>
                </tr>

                {enEdicion && (
                  <EditorPreciosPanel
                    plan={plan}
                    preciosEditando={preciosEditando}
                    membresias={membresias}
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
