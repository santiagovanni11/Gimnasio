/* usuariosExportarCsv - Export del listado de usuarios */

import { descargarCsv } from "./csvComun";

export const exportarUsuariosCsv = (usuarios = []) => {
  if (!usuarios.length) return;

  const encabezados = ["Email", "Nombre", "Apellido", "Rol", "Estado"];

  const filas = usuarios.map((u) => [
    u.email,
    u.nombre ?? "",
    u.apellido ?? "",
    u.rolNombre ?? "",
    u.activo === false ? "Inactivo" : "Activo",
  ]);

  descargarCsv("usuarios", encabezados, filas);
};
