// =========================================================
// INICIO — Bienvenida + KPIs + paneles resumen + accesos.
// Solo compone datos (vía useMemo) y widgets presentacionales.
// =========================================================

import { useMemo } from "react";
import KpiCard from "./KpiCard";
import AlertasVencimiento from "./AlertasVencimiento";
import ProximasClases from "./ProximasClases";
import AccesosRapidos from "./AccesosRapidos";
import GraficoIngresos from "./GraficoIngresos";
import SaludoInicio from "./SaludoInicio";
import SociosPorPlan from "./SociosPorPlan";
import PanelSkeleton from "./PanelSkeleton";
import CabeceraInicio from "./CabeceraInicio";
import WidgetsInicio from "./WidgetsInicio";
import {
  ingresosDeMes,
  tendenciaIngresos,
  serieIngresos6Meses,
  membresiasPorVencer,
  conteoAsistencias,
  ayerISO,
} from "../../utils/resumenInicio";
import { hoyISO } from "../../utils/fechas";
import { diaSemanaDeFecha } from "../../utils/asistencias";
import { formatoMoneda } from "../../utils/pagos";
import { IconoSocios, IconoPagos, IconoAsistencias } from "../../assets/Iconos";

export default function InicioSeccion({
  mensaje,
  socios = [],
  membresias = [],
  pagos = [],
  clases = [],
  horarios = [],
  asistenciasHoy = [],
  asistencias = [],
  inscripciones = [],
  rol = "",
  nombre = "",
  apellido = "",
  membresiasRechazadasIds = null,
  cargando = false,
  permisos = {},
  onRefrescar,
  cambiarSeccion,
}) {
  const hoy = hoyISO();
  const ayer = ayerISO();
  const asistAyer = useMemo(
    () => conteoAsistencias(asistencias, ayer),
    [asistencias, ayer]
  );
  const horariosHoy = useMemo(
    () =>
      horarios
        .filter((h) => Number(h.diaSemana) === diaSemanaDeFecha(hoy))
        .filter((h) => {
          const clase = clases.find((c) => Number(c.id) === Number(h.claseId));
          return clase?.activa !== false;
        })
        .sort((a, b) => String(a.horaInicio).localeCompare(String(b.horaInicio))),
    [horarios, hoy, clases]
  );
  const sociosActivos = useMemo(
    () => socios.filter((s) => s.activo !== false).length,
    [socios]
  );
  const ingresos = useMemo(() => ingresosDeMes(pagos), [pagos]);
  const tendencia = useMemo(() => tendenciaIngresos(pagos), [pagos]);
  const porVencer = useMemo(() => membresiasPorVencer(membresias, 7), [membresias]);
  const asistHoy = useMemo(() => conteoAsistencias(asistenciasHoy), [asistenciasHoy]);
  const tendenciaAsist = asistAyer
    ? {
        pct: Math.abs(Math.round(((asistHoy - asistAyer) / asistAyer) * 100)),
        dir: asistHoy >= asistAyer ? "up" : "down",
      }
    : null;
  const serie = useMemo(() => serieIngresos6Meses(pagos), [pagos]);

  const kpis = [
    { etiqueta: "Socios activos", valor: sociosActivos, sub: "en el gimnasio" },
    { etiqueta: "Ingresos del mes", valor: formatoMoneda(ingresos), tendencia, sub: "pagos válidos" },
    { etiqueta: "Membresías por vencer", valor: porVencer.length, sub: "próximos 7 días", alerta: porVencer.length > 0 },
    { etiqueta: "Asistencias hoy", valor: asistHoy, tendencia: tendenciaAsist, sub: "ingresos del día" },
  ];

  const acciones = [
    { id: "socio", label: "Registrar socio", Icono: IconoSocios, visible: permisos.puedeCrearSocios, onClick: () => cambiarSeccion("socios") },
    { id: "pago", label: "Registrar pago", Icono: IconoPagos, visible: permisos.puedeVerPagos, onClick: () => cambiarSeccion("pagos") },
    { id: "asistencia", label: "Marcar asistencia", Icono: IconoAsistencias, visible: permisos.puedeVerAsistencias, onClick: () => cambiarSeccion("asistencias") },
  ].filter((a) => a.visible);

  return (
    <>
      <SaludoInicio rol={rol} nombre={nombre} apellido={apellido} />

      <CabeceraInicio onRefrescar={onRefrescar} />

      <section className="kpi-grid">
        {kpis.map((k) => (
          <KpiCard key={k.etiqueta} {...k} />
        ))}
      </section>

      <section className="inicio-grid">
        <AlertasVencimiento
          membresias={porVencer}
          onCobrar={() => cambiarSeccion("pagos")}
          onVer={() => cambiarSeccion("membresias")}
        />
        <SociosPorPlan
          membresias={membresias}
          rechazadasIds={membresiasRechazadasIds}
        />
        <WidgetsInicio
          pagos={pagos}
          membresias={membresias}
          membresiasRechazadasIds={membresiasRechazadasIds}
          horariosDelDia={horariosHoy}
          clases={clases}
          inscripciones={inscripciones}
          onCobrar={() => cambiarSeccion("pagos")}
          onIrAAsistencias={() => cambiarSeccion("asistencias")}
        />
        {cargando ? (
          <PanelSkeleton />
        ) : (
          <ProximasClases
            horariosDelDia={horariosHoy}
            clases={clases}
            inscripciones={inscripciones}
            onVer={() => cambiarSeccion("asistencias")}
          />
        )}
        <GraficoIngresos datos={serie} />
      </section>

      <AccesosRapidos acciones={acciones} />

      {mensaje && <div className="info-message">{mensaje}</div>}
    </>
  );
}
