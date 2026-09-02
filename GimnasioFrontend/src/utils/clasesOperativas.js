import { cupoDeHorario } from "./inscripcionesClase";
import { diaSemanaTexto, franjaTexto, compararHorarios } from "./clases";

export const profesorDeClase = (clase, horarios = []) => {
  const lista = horarios
    .filter((h) => Number(h.claseId) === Number(clase?.id))
    .sort(compararHorarios);

  const nombre = lista[0]
    ? `${lista[0].empleadoNombre ?? ""} ${lista[0].empleadoApellido ?? ""}`.trim()
    : "";

  return nombre || "Sin profesor";
};

export const proximaFranjaClase = (clase, horarios = []) => {
  const lista = horarios
    .filter((h) => Number(h.claseId) === Number(clase?.id))
    .sort(compararHorarios);

  if (!lista.length) return "Sin horarios";

  const horario = lista[0];
  return `${diaSemanaTexto(horario.diaSemana)} · ${franjaTexto(
    horario.horaInicio,
    horario.horaFin
  )}`;
};

export const nivelOcupacion = (clase, horarios = [], inscripciones = []) => {
  const lista = horarios.filter((h) => Number(h.claseId) === Number(clase?.id));
  const ocupados = lista.reduce(
    (total, horario) => total + cupoDeHorario(inscripciones, horario, clase.capacidadMaxima).ocupados,
    0
  );

  const capacidad = Math.max(clase.capacidadMaxima || 0, ocupados);
  const ratio = capacidad ? ocupados / capacidad : 0;

  if (ratio >= 1) return { nivel: "Lleno", claseCss: "status-rejected" };
  if (ratio >= 0.7) return { nivel: "Medio", claseCss: "status-warning" };
  return { nivel: "Bajo", claseCss: "status-active" };
};

export const resumenClases = (clases = [], horarios = [], inscripciones = []) => {
  const total = clases.length;
  const activas = clases.filter((clase) => clase.activa !== false).length;
  const horariosActivos = horarios.length;
  const cuposLlenos = clases.filter((clase) => {
    const lista = horarios.filter((h) => Number(h.claseId) === Number(clase.id));
    return lista.some((horario) =>
      cupoDeHorario(inscripciones, horario, clase.capacidadMaxima).lleno
    );
  }).length;

  const proximas = [...clases]
    .filter((clase) => clase.activa !== false)
    .map((clase) => ({
      nombre: clase.nombre,
      proxima: proximaFranjaClase(clase, horarios),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(0, 3);

  return {
    total,
    activas,
    horariosActivos,
    cuposLlenos,
    proximas,
  };
};

export const resumenInscriptos = (inscripciones = []) => {
  const total = inscripciones.length;
  const confirmadas = inscripciones.filter((i) => Number(i.estado) === 2).length;
  const reservas = inscripciones.filter((i) => Number(i.estado) === 1).length;
  const canceladas = inscripciones.filter((i) => Number(i.estado) === 4).length;
  const noAsistio = inscripciones.filter((i) => Number(i.estado) === 5).length;

  return { total, confirmadas, reservas, canceladas, noAsistio };
};

export const mejoresClases = (clases = [], horarios = [], inscripciones = []) =>
  [...clases]
    .map((clase) => {
      const lista = horarios.filter((h) => Number(h.claseId) === Number(clase.id));
      const ocupados = lista.reduce(
        (total, horario) => total + cupoDeHorario(inscripciones, horario, clase.capacidadMaxima).ocupados,
        0
      );
      return { ...clase, ocupados };
    })
    .sort((a, b) => b.ocupados - a.ocupados)
    .slice(0, 3);

export const horariosMasOcupados = (horarios = [], inscripciones = [], capacidadPorClase = 0) =>
  [...horarios]
    .map((horario) => ({
      ...horario,
      ocupados: cupoDeHorario(inscripciones, horario, capacidadPorClase).ocupados,
    }))
    .sort((a, b) => b.ocupados - a.ocupados)
    .slice(0, 3);
