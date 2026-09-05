// =========================================================
// HOOK DE DESPLAZAMIENTO INICIAL
// Devuelve un ref para anclar a un elemento que se monta al
// abrirse (formularios "Nuevo socio", "Nueva membresía") y lo
// lleva a la vista al aparecer, sin tocar la lógica de los
// formularios. Respeta prefers-reduced-motion.
// =========================================================

import { useEffect, useRef } from "react";

export function useDesplazamientoInicial() {
  const ref = useRef(null);

  useEffect(() => {
    const elemento = ref.current;

    if (!elemento?.scrollIntoView) return undefined;

    const reduceMovimiento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    // Timeout breve: deja que el navegador estabilice el
    // layout del formulario recién montado antes de medir.
    const id = setTimeout(() => {
      elemento.scrollIntoView({
        behavior: reduceMovimiento ? "auto" : "smooth",
        block: "start",
      });
    }, 60);

    return () => clearTimeout(id);
  }, []);

  return ref;
}
