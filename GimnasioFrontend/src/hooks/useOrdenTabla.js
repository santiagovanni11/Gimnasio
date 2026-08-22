// =========================================================
// HOOK DE ORDENAMIENTO DE TABLA
// Estado y lógica de orden por columna, sin JSX.
// La presentación del <th> vive en components/common/ThOrdenable.
// =========================================================

import { useState } from "react";

const esFecha = (campo) =>
  campo === "fechaInicio" ||
  campo === "fechaFin" ||
  campo === "vencimiento";

/**
 * @param {string} campoInicial - Columna por defecto.
 * @returns {{ orden, toggleOrden, ordenar }}
 */
export function useOrdenTabla(campoInicial = "apellido") {
  const [orden, setOrden] = useState({
    campo: campoInicial,
    asc: true,
  });

  const toggleOrden = (campo) =>
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));

  /** Devuelve una copia de la lista ordenada según el estado. */
  const ordenar = (lista) => {
    const copia = [...lista];
    const { campo, asc } = orden;
    const factor = asc ? 1 : -1;

    copia.sort((a, b) => {
      if (campo === "vencimiento") {
        // Sin fecha: queda última
        const va = a.membresia?.fechaFin
          ? new Date(a.membresia.fechaFin).getTime()
          : Infinity;
        const vb = b.membresia?.fechaFin
          ? new Date(b.membresia.fechaFin).getTime()
          : Infinity;
        return (va - vb) * factor;
      }

      if (campo === "precioAplicado") {
        return (
          (Number(a[campo] || 0) - Number(b[campo] || 0)) *
          factor
        );
      }

      if (esFecha(campo)) {
        const va = a[campo]
          ? new Date(a[campo]).getTime()
          : Infinity;
        const vb = b[campo]
          ? new Date(b[campo]).getTime()
          : Infinity;
        return (va - vb) * factor;
      }

      return (
        String(a[campo] ?? "")
          .toLowerCase()
          .localeCompare(
            String(b[campo] ?? "").toLowerCase()
          ) * factor
      );
    });

    return copia;
  };

  return { orden, toggleOrden, ordenar };
}
