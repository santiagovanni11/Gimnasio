// =========================================================
// HOOK DE BLOQUEO DE LOGIN
// Cuando la API informa bloqueo por intentos fallidos
// ("Reintentá en N minuto(s)"), convierte ese mensaje en una
// cuenta regresiva en segundos que deshabilita el botón.
// =========================================================

import { useEffect, useState } from "react";

export function useBloqueoLogin(mensaje) {
  const [bloqueadoSegundos, setBloqueadoSegundos] = useState(0);
  const estaBloqueado = bloqueadoSegundos > 0;

  // Detecta el bloqueo en el mensaje de error de la API.
  useEffect(() => {
    if (!mensaje) return undefined;
    const match = mensaje.match(/en (\d+) minuto/);
    if (!match) return undefined;
    // El setState va diferido: la regla set-state-in-effect
    // prohíbe llamarlo sincrónicamente en el cuerpo del efecto.
    const id = setTimeout(
      () => setBloqueadoSegundos(Number(match[1]) * 60),
      0
    );
    return () => clearTimeout(id);
  }, [mensaje]);

  // Cuenta regresiva visible en el botón de ingreso.
  useEffect(() => {
    if (!estaBloqueado) return undefined;
    const id = setInterval(
      () => setBloqueadoSegundos((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [estaBloqueado]);

  return { bloqueadoSegundos, estaBloqueado };
}
