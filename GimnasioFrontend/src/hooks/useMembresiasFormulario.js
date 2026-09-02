// =========================================================
// HOOK DE FORMULARIO DE MEMBRESÍA
// Alta/edición/renovación: en renovación se actualiza la
// misma membresía y la vigencia arranca al terminar la anterior.
// =========================================================

import { useState } from "react";
import { aISO, fechaDesdeValor } from "../utils/fechas";
import { mesesEscalonEntre } from "../utils/membresias";

export function useMembresiasFormulario() {
  const [mostrarFormularioMembresia, setMostrarFormularioMembresia] =
    useState(false);
  const [membresiaEditando, setMembresiaEditando] = useState(null);
  const [modoRenovacion, setModoRenovacion] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const [duracionMembresia, setDuracionMembresia] = useState("");
  const [fechaInicioMembresia, setFechaInicioMembresia] = useState("");
  const [fechaFinMembresia, setFechaFinMembresia] = useState("");
  const [membresiaExistente, setMembresiaExistente] = useState(null);
  const [mostrarAvisoMembresiaExistente, setMostrarAvisoMembresiaExistente] =
    useState(false);
  const [renovacionAutomatica, setRenovacionAutomatica] = useState(false);
  const [metodoPagoAlmacenadoId, setMetodoPagoAlmacenadoId] = useState(null);

  const limpiarCampos = () => {
    setPlanSeleccionado("");
    setDuracionMembresia("");
    setFechaInicioMembresia("");
    setFechaFinMembresia("");
    setMembresiaExistente(null);
    setMostrarAvisoMembresiaExistente(false);
    setSocioSeleccionado("");
    setRenovacionAutomatica(false);
    setMetodoPagoAlmacenadoId(null);
  };

  const cerrarFormularioMembresia = () => {
    setMostrarFormularioMembresia(false);
    setMembresiaEditando(null);
    setModoRenovacion(false);
    limpiarCampos();
  };

  /** Nueva membresía para un socio puntual (viene de Socios). */
  const abrirParaSocio = (socioId) => {
    limpiarCampos();
    setSocioSeleccionado(String(socioId));
    setMostrarFormularioMembresia(true);
  };

  /**
   * Fechas según duración elegida. En renovación la vigencia
   * parte de la fecha de inicio precargada (fin del período
   * anterior); en alta, del día de hoy.
   */
  const calcularFechasMembresia = (meses) => {
    if (!meses) {
      setFechaInicioMembresia("");
      setFechaFinMembresia("");
      return;
    }

    const inicio =
      modoRenovacion && fechaInicioMembresia
        ? fechaDesdeValor(fechaInicioMembresia)
        : new Date();

    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + Number(meses));
    if (fin.getDate() < inicio.getDate()) {
      fin.setDate(0);
    }

    setFechaInicioMembresia(aISO(inicio));
    setFechaFinMembresia(aISO(fin));
  };

  const abrirEdicionMembresia = (membresia) => {
    if (!membresia) return;

    setModoRenovacion(false);
    setMembresiaEditando(membresia);
    setSocioSeleccionado(String(membresia.socioId ?? ""));
    setPlanSeleccionado(String(membresia.planId ?? ""));
    setFechaInicioMembresia(membresia.fechaInicio ? aISO(fechaDesdeValor(membresia.fechaInicio)) : "");
    setFechaFinMembresia(membresia.fechaFin ? aISO(fechaDesdeValor(membresia.fechaFin)) : "");
    setDuracionMembresia(
      mesesEscalonEntre(membresia.fechaInicio, membresia.fechaFin) || ""
    );
    setRenovacionAutomatica(membresia.renovacionAutomatica || false);
    setMetodoPagoAlmacenadoId(membresia.metodoPagoAlmacenadoId || null);
    setMembresiaExistente(null);
    setMostrarAvisoMembresiaExistente(false);
    setMostrarFormularioMembresia(true);
  };

  /** Renovación: actualiza LA MISMA membresía; arranca al fin del período actual. */
  const prepararRenovacionMembresia = (membresia) => {
    limpiarCampos();
    setModoRenovacion(true);
    setRenovacionAutomatica(true);
    setMembresiaEditando(membresia);
    setSocioSeleccionado(String(membresia.socioId ?? ""));
    setPlanSeleccionado(String(membresia.planId ?? ""));
    setFechaInicioMembresia(
      aISO(fechaDesdeValor(membresia.fechaFin))
    );
    setMostrarFormularioMembresia(true);
  };

  /** Reset total del formulario (al cerrar sesión). */
  const reiniciarFormularioMembresia = () =>
    cerrarFormularioMembresia();

  return {
    mostrarFormularioMembresia, setMostrarFormularioMembresia,
    membresiaEditando, modoRenovacion,
    socioSeleccionado, setSocioSeleccionado,
    planSeleccionado, setPlanSeleccionado,
    duracionMembresia, setDuracionMembresia,
    fechaInicioMembresia, setFechaInicioMembresia,
    fechaFinMembresia, setFechaFinMembresia,
    membresiaExistente, setMembresiaExistente,
    mostrarAvisoMembresiaExistente, setMostrarAvisoMembresiaExistente,
    renovacionAutomatica, setRenovacionAutomatica,
    metodoPagoAlmacenadoId, setMetodoPagoAlmacenadoId,
    limpiarCampos,
    cerrarFormularioMembresia,
    abrirFormularioDesdeSocio: abrirParaSocio,
    abrirEdicionMembresia,
    prepararRenovacionMembresia,
    calcularFechasMembresia,
    reiniciarFormularioMembresia
  };
}
