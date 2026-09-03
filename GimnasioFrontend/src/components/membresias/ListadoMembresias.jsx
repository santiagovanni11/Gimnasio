// =========================================================
// LISTADO DE MEMBRESÍAS
// Estados de carga/vacío + tabla con acciones por fila.
// =========================================================

import EstadosLista from "../common/EstadosLista";
import TablaMembresias from "./TablaMembresias";

function ListadoMembresias({
  cargandoMembresias, errorMembresias,
  membresias, membresiasVisibles,
  orden, toggleOrden,
  abrirEdicionMembresia, prepararRenovacionMembresia,
  suspenderMembresia, reactivarMembresia,
  cancelarMembresia, eliminarMembresia,
  verDetalle, seleccionadas, onToggleSeleccion, pagos,
}) {
  return (
    <section className="content-card">
      <EstadosLista
        cargando={cargandoMembresias} error={errorMembresias}
        total={membresias.length} filtrados={membresiasVisibles.length}
        mensajeCargando="Cargando membresías..."
        mensajeVacio="No hay membresías registradas."
        mensajeSinResultado="No se encontraron membresías para los filtros seleccionados."
      />

      {!cargandoMembresias && !errorMembresias && membresiasVisibles.length > 0 && (
        <TablaMembresias
          membresias={membresiasVisibles} orden={orden} toggleOrden={toggleOrden}
          abrirEdicionMembresia={abrirEdicionMembresia}
          prepararRenovacionMembresia={prepararRenovacionMembresia}
          suspenderMembresia={suspenderMembresia}
          reactivarMembresia={reactivarMembresia}
          cancelarMembresia={cancelarMembresia}
          eliminarMembresia={eliminarMembresia}
          verDetalle={verDetalle}
          seleccionadas={seleccionadas}
          onToggleSeleccion={onToggleSeleccion}
          pagos={pagos}
        />
      )}
    </section>
  );
}

export default ListadoMembresias;
