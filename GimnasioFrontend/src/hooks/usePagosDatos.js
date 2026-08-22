// =========================================================
// HOOK DE DATOS DE PAGOS
// Listado, búsqueda, anulación (auditoría) y cambio de estado.
// =========================================================

import { useMemo, useState } from "react";
import { pagosService } from "../services/pagosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { ESTADO_PAGO } from "../utils/pagos";
import { normalizarTextoBusqueda } from "../utils/texto";
import { hoyISO } from "../utils/fechas";
import { dialogoSistema } from "../services/servicioDialogos";

export function usePagosDatos({ onSesionExpirada, notificar }) {
  const [pagos, setPagos] = useState([]);
  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState("");
  const [busquedaPago, setBusquedaPago] = useState("");

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const obtenerPagos = async () => {
    setCargandoPagos(true);
    setErrorPagos("");

    const resultado = await ejecutar({
      peticion: pagosService.obtenerPagos,
      onError: setErrorPagos,
      mensajePermiso: "No tenés permisos para consultar los pagos.",
      mensajeError:
        (status) =>
          `Error al cargar los pagos. Código HTTP: ${status}`,
      mensajeRed:
        "No se pudo conectar con la API para cargar los pagos.",
      etiquetaLog: "Error al obtener pagos:",
    });

    setCargandoPagos(false);

    if (!resultado) return;
    setPagos(Array.isArray(resultado.datos) ? resultado.datos : []);
  };

  /** Filtro de texto sobre socio, referencia y observaciones. */
  const pagosFiltrados = useMemo(() => {
    return pagos.filter((pago) => {
      const texto = normalizarTextoBusqueda(busquedaPago);
      if (!texto) return true;

      const nombreCompleto = normalizarTextoBusqueda(
        `${pago.socioNombre ?? ""} ${pago.socioApellido ?? ""}`
      );

      return (
        nombreCompleto.includes(texto) ||
        normalizarTextoBusqueda(pago.referencia ?? "").includes(texto) ||
        normalizarTextoBusqueda(pago.observaciones ?? "").includes(texto)
      );
    });
  }, [pagos, busquedaPago]);

  /** Anulación lógica: requiere motivo (auditoría). */
  const eliminarPago = async (pago) => {
    const motivo = await dialogoSistema.pedirTexto({
      titulo: "Anular pago",
      mensaje: `Motivo para anular el pago de ${pago.socioNombre} ${pago.socioApellido}:`,
      placeholder: "Ej. cobro duplicado",
      minimoCaracteres: 1,
      textoAceptar: "Anular pago",
    });

    if (motivo === null) return;

    const resultado = await ejecutar({
      peticion: () =>
        pagosService.eliminarPago(pago.id, motivo),
      onError: setErrorPagos,
      mensajePermiso: "No tenés permisos para anular pagos.",
      mensajeError: "No se pudo anular el pago.",
      mensajeRed:
        "No se pudo conectar con la API para anular el pago.",
      etiquetaLog: "Error al anular pago:",
    });

    if (!resultado) return;

    notificar?.("Pago anulado correctamente.");
    await obtenerPagos();
  };

  const cambiarEstadoPago = async (pago, nuevoEstado) => {
    const payload = {
      id: Number(pago.id),
      membresiaId: Number(pago.membresiaId),
      monto: Number(pago.monto),
      formaPago: Number(pago.formaPago),
      estado: Number(nuevoEstado),
      fechaPago: pago.fechaPago || hoyISO(),
      referencia: pago.referencia || null,
      observaciones: pago.observaciones || null,
    };

    const resultado = await ejecutar({
      peticion: () => pagosService.actualizarPago(pago.id, payload),
      onError: setErrorPagos,
      mensajePermiso:
        "No tenés permisos para cambiar el estado del pago.",
      mensajeError: "No se pudo cambiar el estado del pago.",
      mensajeRed:
        "No se pudo conectar con la API para cambiar el estado del pago.",
      etiquetaLog: "Error al cambiar estado del pago:",
    });

    if (!resultado) return;

    notificar?.(`Pago ${textoEstado(nuevoEstado)} correctamente.`);
    await obtenerPagos();
  };

  /** Reset total del dominio (al cerrar sesión). */
  const reiniciarDatos = () => {
    setPagos([]);
    setErrorPagos("");
    setBusquedaPago("");
    setCargandoPagos(false);
  };

  return {
    pagos,
    setPagos,
    cargandoPagos,
    errorPagos,
    setErrorPagos,
    busquedaPago,
    setBusquedaPago,
    pagosFiltrados,
    obtenerPagos,
    eliminarPago,
    cambiarEstadoPago,
    reiniciarDatos,
  };
}

function textoEstado(estado) {
  if (Number(estado) === ESTADO_PAGO.APROBADO) return "aprobado";
  if (Number(estado) === ESTADO_PAGO.CANCELADO) return "cancelado";
  return "actualizado";
}
