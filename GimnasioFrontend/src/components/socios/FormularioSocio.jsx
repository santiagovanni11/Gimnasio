// =========================================================
// FORMULARIO DE SOCIO — Alta y edición de datos personales
// La grilla de campos vive en SocioCampos; el estado y los
// handlers, en useSociosFormulario.
// =========================================================

import SocioCampos from "./SocioCampos";
import { useDesplazamientoInicial } from "../../hooks/useDesplazamientoInicial";

function FormularioSocio({
  socioEditando,
  cerrarFormularioSocio,
  nuevoSocio,
  manejarSoloLetras,
  manejarSoloNumeros,
  manejarCambioSocio,
  crearSocio,
  actualizarSocio,
  mensajeSocio,
  errorSocio,
  guardandoSocio,
}) {
  const refFormulario = useDesplazamientoInicial();

  return (
    <div className="form-card" ref={refFormulario}>
      <div className="form-card-header">
        <div>
          <h3>{socioEditando ? "Editar socio" : "Nuevo socio"}</h3>

          <p>
            {socioEditando
              ? "Modificá los datos del socio."
              : "Completá los datos para registrar al socio."}
          </p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={cerrarFormularioSocio}
        >
          ×
        </button>
      </div>

      <form onSubmit={socioEditando ? actualizarSocio : crearSocio}>
        <SocioCampos
          nuevoSocio={nuevoSocio}
          manejarSoloLetras={manejarSoloLetras}
          manejarSoloNumeros={manejarSoloNumeros}
          manejarCambioSocio={manejarCambioSocio}
        />

        {mensajeSocio && (
          <div className="success-message">{mensajeSocio}</div>
        )}

        {errorSocio && (
          <div className="error-message">{errorSocio}</div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={cerrarFormularioSocio}
            disabled={guardandoSocio}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="primary-small-button"
            disabled={guardandoSocio}
          >
            {guardandoSocio
              ? "Guardando..."
              : socioEditando
              ? "Guardar cambios"
              : "Guardar socio"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioSocio;
