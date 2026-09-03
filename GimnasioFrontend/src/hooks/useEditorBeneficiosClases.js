// Hook editor de beneficios/clases por plan.
// Carga catálogo, precarga asociaciones y persiste cambios.

import { useState } from "react";
import { planesService } from "../services/planesService";
import { beneficiosService } from "../services/beneficiosService";
import { clasesService } from "../services/clasesService";
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

  const [ejecutar] = useState(() => crearEjecutorApi({ onSesionExpirada }));

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
    setSeleccionB((planSeleccionado.beneficios ?? []).map((b) => b.id));
    setSeleccionC((planSeleccionado.clases ?? []).map((c) => c.id));
    setAbierto(true);
  };

  const cerrar = () => {
    setAbierto(false);
    setPlan(null);
  };

  const toggleB = (id) => setSeleccionB((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleC = (id) => setSeleccionC((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const guardar = async () => {
    if (!plan) return;

    setGuardando(true);

    const resultado = await ejecutar({
      peticion: () =>
        planesService.asignarBeneficiosClases(plan.id, seleccionB, seleccionC),
      onError: setError,
      mensajePermiso: "No tenés permisos para editar el plan.",
      mensajeError: "No se pudieron guardar las asociaciones.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al asignar beneficios/clases:",
    });

    setGuardando(false);

    if (!resultado) return;

    setMensaje(`Beneficios y clases de "${plan.nombre}" actualizados.`);
    cerrar();
    if (alExito) await alExito();
  };

  const crearCatalogo = async (tipo, nombre) => {
    const texto = (nombre ?? "").trim();
    if (!texto) {
      setError(`El nombre de la ${tipo} es obligatorio.`);
      return;
    }

    const esBeneficio = tipo === "beneficio";
    const etiqueta = esBeneficio ? "beneficio" : "clase";
    const servicio = esBeneficio
      ? beneficiosService.crearBeneficio(texto)
      : clasesService.crearClase({
          nombre: texto,
          descripcion: texto,
          duracionMinutos: 60,
          capacidadMaxima: 20,
        });
    const setearLista = esBeneficio ? setBeneficiosDisp : setClasesDisp;
    const setearSel = esBeneficio ? setSeleccionB : setSeleccionC;

    setCreando(true);
    const resultado = await ejecutar({
      peticion: () => servicio,
      onError: setError,
      mensajePermiso: `No tenés permisos para crear ${etiqueta}s.`,
      mensajeError: `No se pudo crear ${esBeneficio ? "el beneficio" : "la clase"}.`,
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: `Error al crear ${etiqueta}:`,
    });
    setCreando(false);

    if (!resultado) return;
    const nuevo = resultado.datos;
    setearLista((prev) =>
      prev.some((x) => x.id === nuevo.id)
        ? prev
        : [...prev, { id: nuevo.id, nombre: nuevo.nombre }]
    );
    setearSel((prev) =>
      prev.includes(nuevo.id) ? prev : [...prev, nuevo.id]
    );
    setMensaje(
      `${esBeneficio ? "Beneficio" : "Clase"} "${nuevo.nombre}" agregad${
        esBeneficio ? "o" : "a"
      } al plan.`
    );
  };

  const crearBeneficio = (nombre) => crearCatalogo("beneficio", nombre);
  const crearClase = (nombre) => crearCatalogo("clase", nombre);

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
    crearClase,
  };
}
