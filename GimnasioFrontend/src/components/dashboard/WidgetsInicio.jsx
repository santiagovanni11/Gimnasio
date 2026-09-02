// =========================================================
// WIDGETS DEL INICIO
// Calcula los datos de los paneles Morosos, Vencen hoy, Top
// clases e Inscritos hoy (cálculos puros) y los presenta.
// =========================================================

import { useMemo } from "react";
import { totalAprobadoDelPeriodoPorMembresia } from "../../utils/pagosPeriodo";
import {
  morosos,
  membresiasQueVencenHoy,
  topClasesDeHoy,
  inscritosDeHoy,
} from "../../utils/resumenInicioWidgets";
import VencenHoy from "./VencenHoy";
import InscritosHoy from "./InscritosHoy";
import AccionesUrgentes from "./AccionesUrgentes";

export default function WidgetsInicio({
  pagos = [],
  membresias = [],
  membresiasRechazadasIds = null,
  horariosDelDia = [],
  clases = [],
  inscripciones = [],
  onCobrar,
  onIrAAsistencias,
}) {
  const totalAprobado = useMemo(
    () => totalAprobadoDelPeriodoPorMembresia(pagos, membresias),
    [pagos, membresias]
  );

  const listaMorosos = useMemo(
    () => morosos(membresias, totalAprobado, membresiasRechazadasIds),
    [membresias, totalAprobado, membresiasRechazadasIds]
  );

  const vencenHoy = useMemo(
    () => membresiasQueVencenHoy(membresias),
    [membresias]
  );

  const topClases = useMemo(
    () => topClasesDeHoy(horariosDelDia, clases, inscripciones),
    [horariosDelDia, clases, inscripciones]
  );

  const porClase = useMemo(
    () => inscritosDeHoy(horariosDelDia, clases, inscripciones),
    [horariosDelDia, clases, inscripciones]
  );

  const inscriptosTotales = useMemo(
    () => porClase.reduce((sum, item) => sum + item.socios.length, 0),
    [porClase]
  );

  return (
    <>
      <AccionesUrgentes
        pendientes={listaMorosos.length}
        vencenHoy={vencenHoy.length}
        inscriptos={inscriptosTotales}
        onCobrar={onCobrar}
        onAsistencias={onIrAAsistencias}
      />
      <VencenHoy membresias={vencenHoy} onCobrar={onCobrar} />
      <InscritosHoy porClase={porClase} />
    </>
  );
}
