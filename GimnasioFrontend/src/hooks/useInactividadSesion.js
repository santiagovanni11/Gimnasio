import { useEffect, useRef, useState } from "react";

const TIMEOUT_MS = 15 * 60 * 1000;
const AVISO_MS = 14 * 60 * 1000;
const EVENTOS = ["mousedown", "keydown", "touchstart", "scroll"];

export function useInactividadSesion({ onInactividad }) {
  const [inactivo, setInactivo] = useState(false);
  const timerRef = useRef(null);
  const avisoRef = useRef(null);

  const reiniciar = () => {
    clearTimeout(timerRef.current);
    clearTimeout(avisoRef.current);
    setInactivo(false);

    avisoRef.current = setTimeout(() => setInactivo(true), AVISO_MS);
    timerRef.current = setTimeout(() => onInactividad?.(), TIMEOUT_MS);
  };

  useEffect(() => {
    reiniciar();
    EVENTOS.forEach((e) => document.addEventListener(e, reiniciar, { passive: true }));
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(avisoRef.current);
      EVENTOS.forEach((e) => document.removeEventListener(e, reiniciar));
    };
  }, []);

  const segundosRestantes = inactivo
    ? Math.ceil((TIMEOUT_MS - AVISO_MS) / 1000)
    : null;

  return { debeAvisar: inactivo, segundosRestantes };
}
