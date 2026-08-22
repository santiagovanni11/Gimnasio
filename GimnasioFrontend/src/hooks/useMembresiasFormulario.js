// =========================================================
// HOOK DE FORMULARIO DE MEMBRESÍA
// Alta/edición/renovación: en renovación se actualiza la
// misma membresía y la vigencia arranca al terminar la anterior.
// =========================================================

import { useState } from "react";

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

  const limpiarCampos = () => {
    setPlanSeleccionado("");
    setDuracionMembresia("");
    setFechaInicioMembresia("");
    setFechaFinMembresia("");
    setMembresiaExistente(null);
    setMostrarAvisoMembresiaExistente(false);
    setSocioSeleccionado("");
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
        ? new Date(fechaInicioMembresia)
        : new Date();

    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + Number(meses));

    setFechaInicioMembresia(formatear(inicio));
    setFechaFinMembresia(formatear(fin));
  };

  const calcularMesesDesdeFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "";

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if ([inicio, fin].some((f) => Number.isNaN(f.getTime()))) {
      return "";
    }

    const diferenciaMeses =
      (fin.getFullYear() - inicio.getFullYear()) * 12 +
      (fin.getMonth() - inicio.getMonth());

    if (diferenciaMeses <= 0) return "";

    return [1, 3, 6, 12].includes(diferenciaMeses)
      ? String(diferenciaMeses)
      : "";
  };

  const abrirEdicionMembresia = (membresia) => {
    if (!membresia) return;

    setModoRenovacion(false);
    setMembresiaEditando(membresia);
    setSocioSeleccionado(String(membresia.socioId ?? ""));
    setPlanSeleccionado(String(membresia.planId ?? ""));
    setFechaInicioMembresia(membresia.fechaInicio || "");
    setFechaFinMembresia(membresia.fechaFin || "");
    setDuracionMembresia(
      calcularMesesDesdeFechas(membresia.fechaInicio, membresia.fechaFin) ||
        ""
    );
    setMembresiaExistente(null);
    setMostrarAvisoMembresiaExistente(false);
    setMostrarFormularioMembresia(true);
  };

  /** Renovación: actualiza LA MISMA membresía; arranca al fin del período actual. */
  const prepararRenovacionMembresia = (membresia) => {
    limpiarCampos();
    setModoRenovacion(true);
    setMembresiaEditando(membresia);
    setSocioSeleccionado(String(membresia.socioId ?? ""));
    setPlanSeleccionado(String(membresia.planId ?? ""));
    setFechaInicioMembresia(
      formatear(new Date(membresia.fechaFin))
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
    limpiarCampos,
    cerrarFormularioMembresia,
    abrirFormularioDesdeSocio: abrirParaSocio,
    abrirEdicionMembresia,
    prepararRenovacionMembresia,
    calcularFechasMembresia,
    reiniciarFormularioMembresia
  };
}

function formatear(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}
