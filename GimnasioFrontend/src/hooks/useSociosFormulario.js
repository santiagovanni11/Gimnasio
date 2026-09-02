// =========================================================
// HOOK DE FORMULARIO DE SOCIO
// Estado y validaciones de entrada del alta/edición.
// =========================================================

import { useState } from "react";

export const SOCIO_VACIO = {
  nombre: "",
  apellido: "",
  dni: "",
  fechaNacimiento: "",
  telefono: "",
  email: "",
  direccion: "",
  fotoUrl: "",
  contactoEmergencia: "",
  telefonoEmergencia: "",
};

export function useSociosFormulario() {
  const [nuevoSocio, setNuevoSocio] = useState(SOCIO_VACIO);
  const [mostrarFormularioSocio, setMostrarFormularioSocio] =
    useState(false);
  const [socioEditando, setSocioEditando] = useState(null);
  const [guardandoSocio, setGuardandoSocio] = useState(false);
  const [mensajeSocio, setMensajeSocio] = useState("");
  const [errorSocio, setErrorSocio] = useState("");

  const limpiarFormularioSocio = () => setNuevoSocio(SOCIO_VACIO);

  const abrirFormularioSocio = () => {
    setSocioEditando(null);
    setMensajeSocio("");
    setErrorSocio("");
    limpiarFormularioSocio();
    setMostrarFormularioSocio(true);
  };

  const editarSocio = (socio) => {
    setSocioEditando(socio);
    setNuevoSocio({
      nombre: socio.nombre || "",
      apellido: socio.apellido || "",
      dni: socio.dni || "",
      fechaNacimiento: socio.fechaNacimiento
        ? socio.fechaNacimiento.substring(0, 10)
        : "",
      telefono: socio.telefono || "",
      email: socio.email || "",
      direccion: socio.direccion || "",
      fotoUrl: socio.fotoUrl || "",
      contactoEmergencia: socio.contactoEmergencia || "",
      telefonoEmergencia: socio.telefonoEmergencia || "",
    });
    setMensajeSocio("");
    setErrorSocio("");
    setMostrarFormularioSocio(true);
  };

  const cerrarFormularioSocio = () => {
    setMostrarFormularioSocio(false);
    setSocioEditando(null);
    setMensajeSocio("");
    setErrorSocio("");
    limpiarFormularioSocio();
  };

  const manejarCambioSocio = (event) => {
    const { name, value } = event.target;
    setNuevoSocio((anterior) => ({ ...anterior, [name]: value }));
  };

  const manejarSoloNumeros = (event, campo) => {
    const valor = event.target.value.replace(/\D/g, "");
    setNuevoSocio((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const manejarSoloLetras = (event, campo) => {
    const valor = event.target.value.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
      ""
    );
    setNuevoSocio((anterior) => ({ ...anterior, [campo]: valor }));
  };

  /** Reset del formulario (al cerrar sesión). */
  const reiniciarFormularioSocio = () => {
    setMostrarFormularioSocio(false);
    setSocioEditando(null);
    setGuardandoSocio(false);
    setMensajeSocio("");
    setErrorSocio("");
    setNuevoSocio(SOCIO_VACIO);
  };

  return {
    nuevoSocio,
    mostrarFormularioSocio,
    socioEditando,
    guardandoSocio,
    setGuardandoSocio,
    mensajeSocio,
    setMensajeSocio,
    errorSocio,
    setErrorSocio,
    limpiarFormularioSocio,
    abrirFormularioSocio,
    editarSocio,
    cerrarFormularioSocio,
    manejarCambioSocio,
    manejarSoloNumeros,
    manejarSoloLetras,
    reiniciarFormularioSocio,
  };
}
