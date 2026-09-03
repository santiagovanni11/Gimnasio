// =========================================================
// ACCIONES DE BENEFICIOS (catálogo)
// Crear y eliminar beneficios reutilizando el ejecutor API.
// Cada acción actualiza las listas locales del editor.
// =========================================================

import { useState } from "react";
import { beneficiosService } from "../services/beneficiosService";
import { crearEjecutorApi } from "../services/apiEjecutor";

export function useAccionesBeneficio({
  onSesionExpirada,
  setError,
  setMensaje,
  setBeneficiosDisp,
  setSeleccionB,
}) {
  const [creando, setCreando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

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

  const eliminarBeneficio = async (id) => {
    setEliminando(true);
    const resultado = await ejecutar({
      peticion: () => beneficiosService.eliminarBeneficio(id),
      onError: setError,
      mensajePermiso: "No tenés permisos para eliminar beneficios.",
      mensajeError: "No se pudo eliminar el beneficio.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar beneficio:",
    });
    setEliminando(false);
    if (!resultado) return;

    setBeneficiosDisp((prev) => prev.filter((b) => b.id !== id));
    setSeleccionB((prev) => prev.filter((x) => x !== id));
    setMensaje("Beneficio eliminado del catálogo.");
  };

  return { crearBeneficio, eliminarBeneficio, creando, eliminando };
}
