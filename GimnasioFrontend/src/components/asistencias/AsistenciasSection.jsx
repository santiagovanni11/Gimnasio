// =========================================================
// ASISTENCIAS — Sección operativa
// Fecha de trabajo → clases del día con su lista de
// inscriptos para marcar Presente/Ausente en un gesto.
// =========================================================

import { useEffect, useMemo, useState } from "react";
import SelectorFecha from "./SelectorFecha";
import TarjetaAsistenciaHorario from "./TarjetaAsistenciaHorario";
import MetricasAsistencia from "./MetricasAsistencia";
import EstadosLista from "../common/EstadosLista";
import AsistenciasResumenPanel from "./AsistenciasResumenPanel";
import AsistenciasFiltrosPanel from "./AsistenciasFiltrosPanel";
import AsistenciasHistorialPanel from "./AsistenciasHistorialPanel";
import AsistenciasRiesgoPanel from "./AsistenciasRiesgoPanel";
import AsistenciasAuditoriaPanel from "./AsistenciasAuditoriaPanel";
import AsistenciasAccionesPanel from "./AsistenciasAccionesPanel";
import { descargarCsv } from "../../utils/exportar/csvComun";
import { marcaDeInscripcion } from "../../utils/asistencias";

function AsistenciasSection(props) {
  const {
    clases,
    horarios,
    inscripciones,
    asistencias,
    horariosDelDia,
    asistenciasDelDia,
    inscriptosDe,
    fecha,
    setFecha,
    cargando,
    error,
    mensaje,
    puedeEditarAsistencias,
    marcar,
    obtenerTodo,
  } = props;

  const [filtros, setFiltros] = useState({ claseId: "", profesor: "" });

  // Trae inscripciones, horarios y marcas actualizadas cada vez
  // que se abre la sección (una inscripción hecha en Clases debe
  // verse acá de inmediato).
  useEffect(() => {
    obtenerTodo?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresco al entrar
  }, []);

  const claseDe = useMemo(
    () =>
      new Map(clases.map((clase) => [clase.id, clase])),
    [clases]
  );

  const horariosVisibles = useMemo(
    () =>
      horariosDelDia.filter((horario) => {
        const coincideClase =
          !filtros.claseId || String(horario.claseId) === String(filtros.claseId);
        const nombreProfesor = `${horario.empleadoNombre ?? ""} ${horario.empleadoApellido ?? ""}`.trim();
        const coincideProfesor =
          !filtros.profesor || nombreProfesor === filtros.profesor;

        return coincideClase && coincideProfesor;
      }),
    [horariosDelDia, filtros]
  );

  const resumen = useMemo(() => {
    const visibles = horariosVisibles.flatMap((horario) =>
      inscriptosDe(horario.id, fecha)
    );
    const marcas = asistenciasDelDia.filter((a) =>
      visibles.some((i) => Number(i.id) === Number(a.inscripcionClaseId))
    );
    const presentes = marcas.filter((m) => m.presente).length;
    const ausentes = marcas.filter((m) => !m.presente).length;
    const sinMarcar = Math.max(0, visibles.length - marcas.length);
    const capacidadTotal = horariosVisibles.reduce((total, horario) => {
      const clase = claseDe.get(horario.claseId);
      return total + (Number(clase?.capacidadMaxima) || 0);
    }, 0);

    return {
      total: visibles.length,
      presentes,
      ausentes,
      sinMarcar,
      clases: new Set(horariosVisibles.map((h) => Number(h.claseId))).size,
      ocupacion: capacidadTotal > 0
        ? Math.round((visibles.length / capacidadTotal) * 100)
        : 0,
    };
  }, [horariosVisibles, inscriptosDe, asistenciasDelDia, fecha, claseDe]);

  const exportarListado = () => {
    const filas = horariosVisibles.flatMap((horario) => {
      const clase = claseDe.get(horario.claseId);
      const inscriptos = inscriptosDe(horario.id, fecha);

      return inscriptos.map((inscripcion) => {
        const marca = marcaDeInscripcion(asistenciasDelDia, inscripcion.id, fecha);
        return [
          fecha,
          clase?.nombre ?? "-",
          `${horario.horaInicio ?? ""} a ${horario.horaFin ?? ""}`,
          `${horario.empleadoNombre ?? ""} ${horario.empleadoApellido ?? ""}`.trim(),
          `${inscripcion.socioNombre ?? ""} ${inscripcion.socioApellido ?? ""}`.trim(),
          marca ? (marca.presente ? "Presente" : (marca.motivo === "justificado" ? "Justificado" : "Ausente")) : "Sin marcar",
          marca?.motivo ?? "normal",
        ];
      });
    });

    descargarCsv(
      "asistencias",
      ["Fecha", "Clase", "Franja", "Profesor", "Socio", "Estado", "Motivo"],
      filas
    );
  };

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Asistencias</h2>
          <p>Control operativo por clase, profesor y estado del día.</p>
        </div>

        <SelectorFecha fecha={fecha} setFecha={setFecha} />
      </div>

      {mensaje && <div className="success-message">{mensaje}</div>}
      {error && <div className="error-message">{error}</div>}

      <AsistenciasAccionesPanel
        onExportar={exportarListado}
        disabled={horariosVisibles.length === 0}
      />

      <AsistenciasFiltrosPanel
        horarios={horariosDelDia}
        clases={clases}
        filtros={filtros}
        setFiltros={setFiltros}
      />

      <AsistenciasResumenPanel resumen={resumen} />

      <div className="content-card" style={{ marginBottom: 16, padding: 14 }}>
        <strong>Estado operativo:</strong>{" "}
        {resumen.clases} clases · {resumen.ausentes} ausentes · {resumen.sinMarcar} sin marcar · {resumen.ocupacion}% ocupación
      </div>

      <AsistenciasHistorialPanel
        asistencias={asistencias}
        inscripciones={inscripciones}
      />

      <AsistenciasRiesgoPanel
        inscripciones={inscripciones}
        horarios={horarios}
        clases={clases}
      />

      <AsistenciasAuditoriaPanel asistencias={asistencias} />

      <EstadosLista
        cargando={cargando}
        error=""
        total={horariosVisibles.length}
        filtrados={horariosVisibles.length}
        mensajeCargando="Cargando asistencias..."
        mensajeVacio="No hay clases programadas para este día con los filtros activos."
      />

      {!cargando &&
        horariosVisibles.map((horario) => {
          const clase = claseDe.get(horario.claseId);
          if (!clase) return null;

          return (
            <TarjetaAsistenciaHorario
              key={horario.id}
              clase={clase}
              horario={horario}
              inscriptos={inscriptosDe(horario.id, fecha)}
              asistenciasDelDia={asistenciasDelDia}
              fecha={fecha}
              puedeEditar={puedeEditarAsistencias}
              onMarcar={({ inscripcion, presente, motivo }) =>
                marcar({
                  inscripcion,
                  presente,
                  motivo,
                  fechaIso: fecha,
                  asistencias: asistenciasDelDia,
                  puedeEditar: puedeEditarAsistencias,
                })
              }
            />
          );
        })}

      <MetricasAsistencia
        clases={clases}
        horarios={horarios}
        inscripciones={inscripciones}
        asistencias={asistencias}
        filtros={filtros}
        fecha={fecha}
      />
    </section>
  );
}

export default AsistenciasSection;
