// =========================================================
// OPERACIONES DE SOCIOS
// Fábrica con el alta y la actualización del socio.
// Las bajas con confirmación viven en la fachada useSocios.
// =========================================================

import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { sociosService } from "../services/sociosService";
import { registrarCambioSocio } from "../utils/sociosMetadata";

const autorActual = () => {
  const nombre = obtenerNombre();
  const apellido = obtenerApellido();
  const base = [nombre, apellido].filter(Boolean).join(" ");
  return base || "Sistema";
};

export function crearOperacionesSocios({
  formulario,
  datos,
  ejecutar,
  alSocioCreado,
}) {
  /** Alta de socio: crea, refresca y notifica al orquestador. */
  const crearSocio = async (event) => {
    event.preventDefault();
    formulario.setGuardandoSocio(true);
    formulario.setMensajeSocio("");
    formulario.setErrorSocio("");

    const resultado = await ejecutar({
      peticion: () => sociosService.crearSocio(formulario.nuevoSocio),
      onError: formulario.setErrorSocio,
      mensajePermiso: "No tenés permisos para crear socios.",
      mensajeError: "No se pudo crear el socio.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al crear socio:",
    });

    formulario.setGuardandoSocio(false);

    if (!resultado) return;

    const datosRespuesta = resultado.datos;
    const creado =
      datosRespuesta && typeof datosRespuesta === "object"
        ? datosRespuesta
        : null;
    const socioIdCreado = creado?.id ?? datosRespuesta?.socioId ?? null;

    if (socioIdCreado) {
      registrarCambioSocio(
        Number(socioIdCreado),
        "Alta de socio",
        `${formulario.nuevoSocio.nombre} ${formulario.nuevoSocio.apellido}`,
        autorActual()
      );
    }

    formulario.setMensajeSocio("Socio creado correctamente.");
    await datos.obtenerSocios();
    formulario.limpiarFormularioSocio();
    formulario.cerrarFormularioSocio();

    if (socioIdCreado) alSocioCreado?.(Number(socioIdCreado));
  };

  /** Actualización de datos del socio existente. */
  const actualizarSocio = async (event) => {
    event.preventDefault();

    if (!formulario.socioEditando) return;

    const { socioEditando } = formulario;

    formulario.setGuardandoSocio(true);
    formulario.setMensajeSocio("");
    formulario.setErrorSocio("");

    const resultado = await ejecutar({
      peticion: () =>
        sociosService.actualizarSocio(
          socioEditando,
          formulario.nuevoSocio
        ),
      onError: formulario.setErrorSocio,
      mensajePermiso: "No tenés permisos para modificar socios.",
      mensajeError:
        (status) =>
          `No se pudo actualizar el socio. Código HTTP: ${status}`,
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al actualizar socio:",
    });

    formulario.setGuardandoSocio(false);

    if (!resultado) return;

    registrarCambioSocio(
      Number(formulario.socioEditando.id),
      "Edición de socio",
      `${formulario.socioEditando.nombre} ${formulario.socioEditando.apellido}`,
      autorActual()
    );

    formulario.setMensajeSocio("Socio actualizado correctamente.");
    await datos.obtenerSocios();
    window.setTimeout(() => formulario.cerrarFormularioSocio(), 1000);
  };

  return { crearSocio, actualizarSocio };
}
