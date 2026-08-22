// =========================================================
// EDICIÓN DE PRECIOS POR PLAN
// Fábrica con validación por celda en vivo, confirmación
// anti-salto grosero (>20%), guardado contra la API y
// vigencia programada opcional ("rige desde").
// =========================================================

import { useRef } from "react";
import { planesService } from "../services/planesService";
import { dialogoSistema } from "../services/servicioDialogos";
import {
  CAMPOS_ESCALON,
  errorEscalonCelda,
} from "../utils/preciosConfig";

export function useEdicionPrecios({
  planes,
  preciosEditando,
  setPreciosEditando,
  setPlanEditando,
  setGuardandoPrecios,
  setMensajePrecios,
  setErrorPrecios,
  ejecutar,
  obtenerPlanes,
}) {
  // Copia de valores vigentes al entrar en edición (anti-salto)
  const preciosOriginales = useRef({});

  /** Inicializa el formulario y guarda copia de los vigentes. */
  const prepararPreciosEditando = () => {
    const iniciales = {};

    planes.forEach((plan) => {
      iniciales[plan.id] = {
        precio1Mes: plan.precio1Mes ?? 0,
        precio3Meses: plan.precio3Meses ?? 0,
        precio6Meses: plan.precio6Meses ?? 0,
        precio12Meses: plan.precio12Meses ?? 0,
      };
    });

    setPreciosEditando(iniciales);
    preciosOriginales.current = JSON.parse(
      JSON.stringify(iniciales)
    );
  };

  /** Error de UNA celda contra el escalón (validación en vivo). */
  const validarCelda = (planId, campo) =>
    errorEscalonCelda(preciosEditando[planId] ?? {}, campo);

  /** Salto >20% respecto del valor vigente -> confirmación. */
  const confirmarSaltoGrosero = (planId, nuevos) => {
    const previos = preciosOriginales.current[planId];
    if (!previos) return true;

    const saltos = CAMPOS_ESCALON.filter(({ clave }) => {
      const viejo = Number(previos[clave]);
      const nuevo = Number(nuevos[clave]);

      return (
        viejo > 0 &&
        Math.abs((nuevo - viejo) / viejo) * 100 > 20
      );
    }).map(({ titulo, clave }) => {
      const viejo = Number(previos[clave]);
      const nuevo = Number(nuevos[clave]);
      const pct = Math.round(
        Math.abs((nuevo - viejo) / viejo) * 100
      );

      return `${titulo}: $${viejo} → $${nuevo} (${
        pct > 0 ? "+" : ""
      }${pct}%)`;
    });

    if (!saltos.length) return true;

    return dialogoSistema.confirmar({
      titulo: "Cambios importantes de precio",
      mensaje:
        "Estás por aplicar cambios importantes:\n\n" +
        saltos.join("\n"),
      textoAceptar: "Confirmar cambios",
    });
  };

  /** Valida escalón, confirma y persiste (ahora o programado). */
  const guardarPreciosPlan = async (planId, vigenteDesde = null) => {
    setGuardandoPrecios(true);
    setMensajePrecios("");
    setErrorPrecios("");

    const precios = preciosEditando[planId];

    if (!precios) {
      setGuardandoPrecios(false);
      return;
    }

    const numericos = {
      precio1Mes: Number(precios.precio1Mes),
      precio3Meses: Number(precios.precio3Meses),
      precio6Meses: Number(precios.precio6Meses),
      precio12Meses: Number(precios.precio12Meses),
    };

    for (const { clave } of CAMPOS_ESCALON) {
      const errorCelda = errorEscalonCelda(numericos, clave);

      if (errorCelda) {
        setErrorPrecios(errorCelda);
        setGuardandoPrecios(false);
        return;
      }
    }

    if (!confirmarSaltoGrosero(planId, numericos)) {
      setGuardandoPrecios(false);
      return;
    }

    const resultado = await ejecutar({
      peticion: () =>
        planesService.actualizarPrecios(
          planId,
          numericos,
          vigenteDesde || null
        ),
      onError: setErrorPrecios,
      mensajePermiso:
        "No tenés permisos para modificar los precios.",
      mensajeError: "No se pudieron guardar los precios.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al guardar precios:",
    });

    setGuardandoPrecios(false);

    if (!resultado) return;

    if (resultado.datos?.programado && resultado.datos?.vigenteDesde) {
      const fecha = new Date(
        resultado.datos.vigenteDesde
      ).toLocaleDateString("es-AR");

      setMensajePrecios(
        `Cambios programados: rigen desde el ${fecha}.`
      );
    } else {
      setMensajePrecios("Precios actualizados correctamente.");
    }

    setPlanEditando(null);
    await obtenerPlanes();
  };

  return {
    prepararPreciosEditando,
    validarCelda,
    guardarPreciosPlan,
    reiniciarOriginales: () => {
      preciosOriginales.current = {};
    },
  };
}
