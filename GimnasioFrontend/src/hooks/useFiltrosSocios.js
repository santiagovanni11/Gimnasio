// =========================================================
// FILTROS DE SOCIOS POR MEMBRESÍA Y MOROSIDAD
// Aplica sobre el listado ya filtrado por texto/inactivos:
// membresía vigente vs sin membresía, y morosos (saldo
// pendiente del período, excluyendo rechazadas).
// =========================================================

import { useMemo, useState } from "react";
import { totalAprobadoDelPeriodoPorMembresia } from "../utils/pagosPeriodo";
import { getMembresiasConSaldoPendiente } from "../utils/membresias";
import { tieneMembresiaVigente, getMembresiaVisual } from "../utils/socios";
import { obtenerEstadoRealSocio } from "../utils/sociosMetadata";

const CATEGORIA_ESTADO = {
  Vigente: "vigente",
  "Por vencer": "porVencer",
  Vencida: "vencida",
  Rechazada: "rechazada",
  "Sin membresía": "sin",
};

export function useFiltrosSocios({
  sociosFiltrados,
  pagos = [],
  membresias = [],
  rechazadasIds,
}) {
  const [filtroMembresia, setFiltroMembresia] = useState("");
  const [soloMorosos, setSoloMorosos] = useState(false);
  const [filtroEstadoMembresia, setFiltroEstadoMembresia] = useState("");
  const [filtroEstadoSocio, setFiltroEstadoSocio] = useState("");

  const sociosMorososIds = useMemo(() => {
    const pagadoPorMembresia = totalAprobadoDelPeriodoPorMembresia(
      pagos,
      membresias
    );

    const morosas = getMembresiasConSaldoPendiente(
      membresias,
      pagadoPorMembresia,
      rechazadasIds
    );

    return new Set(morosas.map((m) => Number(m.socioId)));
  }, [pagos, membresias, rechazadasIds]);

  const sociosVisibles = useMemo(() => {
    if (
      !filtroMembresia &&
      !soloMorosos &&
      !filtroEstadoMembresia &&
      !filtroEstadoSocio
    ) {
      return sociosFiltrados;
    }

    return sociosFiltrados.filter((socio) => {
      const conVigente = tieneMembresiaVigente(socio, rechazadasIds);

      if (filtroMembresia === "vigente" && !conVigente) return false;
      if (filtroMembresia === "sin" && conVigente) return false;

      if (filtroEstadoMembresia) {
        const texto = getMembresiaVisual(
          socio,
          membresias,
          rechazadasIds
        ).texto;
        if (CATEGORIA_ESTADO[texto] !== filtroEstadoMembresia) return false;
      }

      if (filtroEstadoSocio) {
        const estado = obtenerEstadoRealSocio(socio, {
          membresias,
          pagos,
          rechazadasIds,
        });
        if (estado !== filtroEstadoSocio) return false;
      }

      if (soloMorosos && !sociosMorososIds.has(Number(socio.id))) {
        return false;
      }

      return true;
    });
  }, [
    sociosFiltrados,
    filtroMembresia,
    soloMorosos,
    filtroEstadoMembresia,
    filtroEstadoSocio,
    sociosMorososIds,
    membresias,
    pagos,
    rechazadasIds,
  ]);

  return {
    filtroMembresia,
    setFiltroMembresia,
    soloMorosos,
    setSoloMorosos,
    filtroEstadoMembresia,
    setFiltroEstadoMembresia,
    filtroEstadoSocio,
    setFiltroEstadoSocio,
    sociosVisibles,
  };
}
