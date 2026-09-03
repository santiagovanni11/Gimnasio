// =========================================================
// HOOK EDITOR DE BENEFICIOS/CLASES POR PLAN
// Carga el catálogo, precarga las asociaciones actuales y
// persiste los cambios. No toca el estado de planes.
// =========================================================

import { useState } from "react";
import { planesService } from "../services/planesService";
import { beneficiosService } from "../services/beneficiosService";
import { crearEjecutorApi } from "../services/apiEjecutor";

export function useEditorBeneficiosClases({
  onSesionExpirada,
  setMensaje,
  setError,
  alExito,
}) {
  const [abierto, setAbierto] = useState(false);
  const [plan, setPlan] = useState(null);
  const [beneficiosDisp, setBeneficiosDisp] = useState([]);
  const [clasesDisp, setClasesDisp] = useState([]);
  const [seleccionB, setSeleccionB] = useState([]);
  const [seleccionC, setSeleccionC] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [creando, setCreando] = useState(false);

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const abrir = async (planSeleccionado) => {
    setPlan(planSeleccionado);
    setGuardando(true);

    const referencia = await ejecutar({
      peticion: planesService.referencias,
      onError: setError,
      mensajePermiso: "No tenés permisos para ver el catálogo.",
      mensajeError: "No se pudo cargar el catálogo.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cargar referencias:",
    });

    setGuardando(false);

    setBeneficiosDisp(referencia?.datos?.beneficios ?? []);
    setClasesDisp(referencia?.datos?.clases ?? []);
    setSeleccionB(
      (planSeleccionado.beneficios ?? []).map((b) => b.id)
    );
    setSeleccionC(
      (planSeleccionado.clases ?? []).map((c) => c.id)
    );
    setAbierto(true);
  };

  const cerrar = () => {
    setAbierto(false);
    setPlan(null);
  };

  const toggleB = (id) =>
    setSeleccionB((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );

  const toggleC = (id) =>
    setSeleccionC((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );

  const guardar = async () => {
    if (!plan) return;

    setGuardando(true);

    const resultado = await ejecutar({
      peticion: () =>
        planesService.asignarBeneficiosClases(
          plan.id,
          seleccionB,
          seleccionC
        ),
      onError: setError,
      mensajePermiso: "No tenés permisos para editar el plan.",
      mensajeError: "No se pudieron guardar las asociaciones.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al asignar beneficios/clases:",
    });

    setGuardando(false);

    if (!resultado) return;

    setMensaje(
      `Beneficios y clases de "${plan.nombre}" actualizados.`
    );
    cerrar();
    if (alExito) await alExito();
  };
  const crearBeneficio = async (nombre) => {
    const texto = (nombre ?? "").trim();
    if (!texto) {
      setError("El nombre del beneficio es obligatorio.");
      return;
    }

    setCreando(true);
    const resultado = await ejecutar({
      peticion: () => beneficiosService.crearBeneficio(texto),
      onError: setError,
      mensajePermiso: "No tenés permisos para crear beneficios.",
      mensajeError: "No se pudo crear el beneficio.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al crear beneficio:",
    });
    setCreando(false);
    if (!resultado) return;
    const nuevo = resultado.datos;
    setBeneficiosDisp((prev) =>
      prev.some((b) => b.id === nuevo.id)
        ? prev
        : [...prev, { id: nuevo.id, nombre: nuevo.nombre }]
    );
    setSeleccionB((prev) =>
      prev.includes(nuevo.id) ? prev : [...prev, nuevo.id]
    );
    setMensaje(`Beneficio "${nuevo.nombre}" agregado al plan.`);
  };
  return {
    abierto,
    plan,
    beneficiosDisp,
    clasesDisp,
    seleccionB,
    seleccionC,
    guardando,
    creando,
    abrir,
    cerrar,
    toggleB,
    toggleC,
    guardar,
    crearBeneficio,
  };
}
