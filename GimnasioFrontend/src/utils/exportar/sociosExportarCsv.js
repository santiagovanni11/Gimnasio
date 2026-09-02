/* sociosExportarCsv - Exportación del listado de socios a CSV */

import { descargarCsv } from "./csvComun";
import { fechaTexto } from "../fechas";

export const exportarSociosCsv = (socios = []) => {
  if (!socios.length) return;

  const encabezados = [
    "Nombre",
    "Apellido",
    "DNI",
    "Fecha nacimiento",
    "Teléfono",
    "Email",
    "Dirección",
    "Estado",
    "Membresía",
    "Vencimiento",
  ];

  const filas = socios.map((s) => [
    s.nombre,
    s.apellido,
    s.dni,
    fechaTexto(s.fechaNacimiento),
    s.telefono,
    s.email,
    s.direccion || "",
    s.activo === false ? "Inactivo" : "Activo",
    s.membresia?.estado || "Sin membresía",
    fechaTexto(s.membresia?.fechaFin),
  ]);

  descargarCsv("socios", encabezados, filas);
};
