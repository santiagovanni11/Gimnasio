// =========================================================
// TESTS DE WIDGETS DEL INICIO
// Cubre los cálculos puros de morosos, vencen hoy, top clases
// e inscritos del día.
// =========================================================

import { describe, it, expect } from "vitest";
import {
  membresiasQueVencenHoy,
  morosos,
  topClasesDeHoy,
  inscritosDeHoy,
} from "./resumenInicioWidgets";

const membresia = (id, estado, socioNombre, fin, precio, saldo = 0) => ({
  id,
  estado,
  socioNombre,
  socioApellido: "",
  fechaFin: fin,
  precioAplicado: precio,
  saldo,
});

describe("membresiasQueVencenHoy", () => {
  it("incluye solo activas que vencen hoy", () => {
    const ahora = new Date();
    const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    const listado = [
      membresia(1, 2, "Ana", hoy, 100),
      membresia(2, 2, "Leo", "2040-01-01", 100),
      membresia(3, 1, "Ruth", hoy, 100),
    ];

    const resultado = membresiasQueVencenHoy(listado);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].socioNombre).toBe("Ana");
  });
});

describe("morosos", () => {
  it("ordena por mayor saldo y excluye rechazadas", () => {
    const totalAprobado = new Map([[1, 50], [2, 0]]);
    const rechazadas = new Set([3]);
    const listado = [
      membresia(1, 2, "Ana", "2040-01-01", 100),
      membresia(2, 2, "Leo", "2040-01-01", 100),
      membresia(3, 2, "Ruth", "2040-01-01", 100),
    ];

    const resultado = morosos(listado, totalAprobado, rechazadas);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].saldo).toBe(100);
    expect(resultado[1].saldo).toBe(50);
  });
});

describe("topClasesDeHoy e inscritosDeHoy", () => {
  const horarios = [
    { id: 1, claseId: 10, horaInicio: "09:00" },
    { id: 2, claseId: 11, horaInicio: "11:00" },
  ];
  const clases = [
    { id: 10, nombre: "Spinning" },
    { id: 11, nombre: "Yoga" },
  ];
  const inscripciones = [
    { horarioClaseId: 1, socioNombre: "Ana", socioApellido: "Pérez", estado: 1, fechaHasta: "2099-01-01" },
    { horarioClaseId: 1, socioNombre: "Leo", socioApellido: "Díaz", estado: 1, fechaHasta: "2099-01-01" },
    { horarioClaseId: 2, socioNombre: "Ruth", socioApellido: "Leal", estado: 1, fechaHasta: "2099-01-01" },
  ];

  it("rankia las clases por cantidad de inscriptos", () => {
    const resultado = topClasesDeHoy(horarios, clases, inscripciones);

    expect(resultado[0].nombre).toBe("Spinning");
    expect(resultado[0].cantidad).toBe(2);
    expect(resultado[1].cantidad).toBe(1);
  });

  it("lista los nombres de los inscriptos por clase", () => {
    const resultado = inscritosDeHoy(horarios, clases, inscripciones);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].socios).toContain("Ana Pérez");
  });
});
