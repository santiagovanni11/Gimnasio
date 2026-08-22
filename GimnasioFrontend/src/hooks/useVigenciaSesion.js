// =========================================================
// HOOK VIGENCIA DE SESIÓN
// Vigila la expiración del JWT guardada en almacenSesion.
// Devuelve los segundos restantes y si corresponde avisar.
// Si no hay dato (sesiones previas), no avisa ni expira.
// =========================================================

import { useEffect, useState } from "react";
import { obtenerExpira } from "../services/almacenSesion";

const INTERVALO_CONTROL_MS = 15000;
const MINUTOS_AVISO = 5;

const calcularSegundosRestantes = () => {
  const expira = obtenerExpira();

  if (!expira) return null;

  return Math.floor(
    (new Date(expira).getTime() - Date.now()) / 1000
  );
};

export function useVigenciaSesion({ activo, onExpirada }) {
  const [segundosRestantes, setSegundosRestantes] =
    useState(calcularSegundosRestantes);

  useEffect(() => {
    if (!activo) return undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- recalcula contra el reloj al montar/activar
    setSegundosRestantes(calcularSegundosRestantes());

    const intervalo = setInterval(() => {
      setSegundosRestantes(calcularSegundosRestantes());
    }, INTERVALO_CONTROL_MS);

    return () => clearInterval(intervalo);
  }, [activo]);

  // Expiró: cerrar sesión una única vez.
  useEffect(() => {
    if (
      activo &&
      segundosRestantes !== null &&
      segundosRestantes <= 0
    ) {
      onExpirada?.();
    }
  }, [activo, segundosRestantes, onExpirada]);

  const debeAvisar =
    segundosRestantes !== null &&
    segundosRestantes > 0 &&
    segundosRestantes <= MINUTOS_AVISO * 60;

  return { segundosRestantes, debeAvisar };
}
