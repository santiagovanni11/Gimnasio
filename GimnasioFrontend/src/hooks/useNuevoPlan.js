// =========================================================
// HOOK NUEVO PLAN
// Estado del formulario de alta de planes: datos generales +
// escalón de precios con validación en vivo por celda.
// =========================================================

import { useState } from "react";
import { planesService } from "../services/planesService";
import { mensajeDeError } from "../services/apiClient";
import { CAMPOS_ESCALON, errorEscalonCelda } from "../utils/preciosConfig";

const CAMPOS_INICIALES = {
  nombre: "",
  descripcion: "",
};

const ESCALON_INICIAL = {
  precio1Mes: "",
  precio3Meses: "",
  precio6Meses: "",
  precio12Meses: "",
};

export function useNuevoPlan({ alCrear }) {
  const [abierto, setAbierto] = useState(false);
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [escalon, setEscalon] = useState(ESCALON_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const abrir = () => {
    setCampos(CAMPOS_INICIALES);
    setEscalon(ESCALON_INICIAL);
    setError("");
    setAbierto(true);
  };

  const cerrar = () => setAbierto(false);

  const cambiarCampo = (campo, valor) =>
    setCampos((previo) => ({ ...previo, [campo]: valor }));

  const cambiarPrecio = (campo, valor) =>
    setEscalon((previo) => ({ ...previo, [campo]: valor }));

  /** Primer error del escalón ascendente, si lo hay. */
  const validar = () => {
    if (!campos.nombre.trim()) {
      return "El nombre del plan es obligatorio.";
    }

    for (const { clave } of CAMPOS_ESCALON) {
      const errorCelda = errorEscalonCelda(escalon, clave);
      if (errorCelda) return errorCelda;
    }

    return "";
  };

  const guardar = async (event) => {
    event.preventDefault();

    const validacion = validar();
    if (validacion) {
      setError(validacion);
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const payload = {
        nombre: campos.nombre.trim(),
        descripcion: campos.descripcion.trim(),
        tipo: "Basico",
        activo: true,
        precio: Number(escalon.precio1Mes),
        ...escalon,
      };

      const { respuesta, datos: creada } =
        await planesService.crearPlan(payload);

      if (!respuesta.ok) {
        setError(
          mensajeDeError(creada, "No se pudo crear el plan.")
        );
        return;
      }

      setAbierto(false);

      if (alCrear) {
        await alCrear(`Plan "${payload.nombre}" creado.`);
      }
    } catch (errorPeticion) {
      console.error("Error al crear plan:", errorPeticion);
      setError("No se pudo conectar con la API.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    nuevoPlanAbierto: abierto,
    camposNuevoPlan: campos,
    escalonNuevoPlan: escalon,
    guardandoNuevoPlan: guardando,
    errorNuevoPlan: error,
    abrirNuevoPlan: abrir,
    cerrarNuevoPlan: cerrar,
    cambiarCampoNuevoPlan: cambiarCampo,
    cambiarPrecioNuevoPlan: cambiarPrecio,
    guardarNuevoPlan: guardar,
  };
}
