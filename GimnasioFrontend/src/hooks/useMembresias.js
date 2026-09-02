// =========================================================
// HOOK DE MEMBRESÍAS (FACHADA)
// Compone formulario + datos + guardado + bajas y expone el
// contrato que consumen las páginas. Sin lógica propia.
// =========================================================

import { useRef, useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { useMembresiasFormulario } from "./useMembresiasFormulario";
import { useMembresiasDatos } from "./useMembresiasDatos";
import { crearGuardadoMembresia } from "./useMembresiaGuardar";
import { crearBajasMembresias } from "./useMembresiasBajas";
import { crearEstadosMembresias } from "./useMembresiasEstados";
import { crearRenovacionRapida } from "./crearRenovacionRapida";

export function useMembresias(opciones) {
  const {
    onSesionExpirada,
    getSociosActivos,
    getPlanes,
    obtenerPrecioSegunDuracion,
    irASeccion,
    limpiarMensaje,
    notificar: notificarOpciones,
    alMembresiaCreada,
  } = opciones || {};

  const formulario = useMembresiasFormulario();
  const formularioRef = useRef(formulario);
  formularioRef.current = formulario;

  const datos = useMembresiasDatos({
    onSesionExpirada,
    getSociosActivos,
  });

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const notificar = (texto) => notificarOpciones?.(texto);

  const guardar = crearGuardadoMembresia({
    getFormulario: () => formularioRef.current, datos, ejecutar, notificar,
    getPlanes, obtenerPrecioSegunDuracion, alMembresiaCreada,
  });

  const bajas = crearBajasMembresias({
    formulario, datos, ejecutar, notificar,
  });

  const estados = crearEstadosMembresias({
    datos, ejecutar, notificar,
  });

  /** Renovación: mismo socio y plan, fechas nuevas. */
  const prepararRenovacionMembresia = (membresia) => {
    limpiarMensaje?.();
    datos.setErrorMembresias("");
    formulario.prepararRenovacionMembresia(membresia);
  };

  /** Renovación en un clic + oferta de cobro inmediato. */
  const { renovarRapido } = crearRenovacionRapida({
    ejecutar,
    notificar,
    avisarError: (texto) => datos.setErrorMembresias(texto),
    obtenerMembresias: datos.obtenerMembresias,
    getPlanes,
    obtenerPrecioSegunDuracion,
    abrirFormularioRenovacion: prepararRenovacionMembresia,
    alRenovada: alMembresiaCreada,
  });

  /** Nueva membresía desde la ficha del socio (cambia sección). */
  const abrirFormularioDesdeSocio = (socioId) => {
    irASeccion?.("membresias");
    formulario.abrirFormularioDesdeSocio(socioId);
  };

  const crearMembresia = async () => {
    limpiarMensaje?.();
    datos.setErrorMembresias("");
    await guardar();
  };

  /** Reset total del dominio (al cerrar sesión). */
  const reiniciar = () => {
    datos.setMembresias([]);
    datos.setErrorMembresias("");
    datos.setBusquedaMembresia("");
    formulario.reiniciarFormularioMembresia();
  };

  return {
    ...formulario,
    ...datos,

    abrirFormularioDesdeSocio,
    prepararRenovacionMembresia,
    renovarRapido,
    crearMembresia,
    eliminarMembresia: bajas.eliminarMembresia,
    cancelarMembresia: bajas.cancelarMembresia,
    suspenderMembresia: estados.suspenderMembresia,
    reactivarMembresia: estados.reactivarMembresia,
    reiniciar,
  };
}
