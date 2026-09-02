// USUARIOS — Sección (solo Administrador)
import { useState, useMemo } from "react";
import TablaUsuarios from "./TablaUsuarios";
import AuditoriaUsuarioModal from "./AuditoriaUsuarioModal";
import FormularioUsuarioModal from "./FormularioUsuarioModal";
import AsignarClaseModal from "./AsignarClaseModal";
import FiltrosUsuarios from "./FiltrosUsuarios";
import TarjetasResumenUsuarios from "./TarjetasResumenUsuarios";
import UsuariosHistorialAccesosPanel from "./UsuariosHistorialAccesosPanel";
import UsuariosSeguridadPanel from "./UsuariosSeguridadPanel";
import EstadoVacio from "../common/EstadoVacio";
import { useFormularioUsuario } from "../../hooks/useFormularioUsuario";
import { useAsignacionClasesProfesor } from "../../hooks/useAsignacionClasesProfesor";

function UsuariosSection({
  usuarios,
  usuariosFiltrados,
  roles,
  verInactivos, setVerInactivos,
  filtroRol, setFiltroRol,
  miUsuarioId,
  cargando, error, mensaje, setMensaje,
  obtenerUsuarios,
  alternarEstado, cambiarRol,
  resetearPassword, desbloquear,
  eliminarUsuario,
  auditoria, verAuditoria, cerrarAuditoria,
  cerrarSesion,
}) {
  const [busqueda, setBusqueda] = useState("");

  const formularioUsuario = useFormularioUsuario({
    roles,
    obtenerUsuarios,
    notificar: setMensaje,
  });

  const asignacion = useAsignacionClasesProfesor({
    onSesionExpirada: cerrarSesion,
    notificar: setMensaje,
  });

  const [ordenUsuarios, setOrdenUsuarios] = useState("nombre_asc");

  // Búsqueda sobre el listado ya filtrado por estado y ordenado
  const resultados = usuariosFiltrados.filter((usuario) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;

    const nombreCompleto =
      `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`
        .toLowerCase()
        .trim();

    return (
      usuario.email.toLowerCase().includes(texto) ||
      usuario.rolNombre.toLowerCase().includes(texto) ||
      nombreCompleto.includes(texto)
    );
  });

  const resultadosOrdenados = useMemo(() => {
    const copia = [...resultados];
    switch (ordenUsuarios) {
      case "nombre_desc":
        return copia.sort((a, b) => `${b.nombre} ${b.apellido}`.localeCompare(`${a.nombre} ${a.apellido}`));
      case "alta_desc":
        return copia.sort((a, b) => (b.fechaCreacion || "").localeCompare(a.fechaCreacion || ""));
      case "acceso_desc":
        return copia.sort((a, b) => (b.ultimoAcceso || "").localeCompare(a.ultimoAcceso || ""));
      default:
        return copia.sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));
    }
  }, [resultados, ordenUsuarios]);

  const hayOcultos =
    !busqueda && usuarios.length > 0 && resultados.length === 0;

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Usuarios</h2>
          <p>Cuentas con acceso al sistema.</p>
        </div>

        <FiltrosUsuarios
          busqueda={busqueda} setBusqueda={setBusqueda}
          filtroRol={filtroRol} setFiltroRol={setFiltroRol}
          verInactivos={verInactivos} setVerInactivos={setVerInactivos}
          usuarios={resultados}
          roles={roles}
          ordenUsuarios={ordenUsuarios} setOrdenUsuarios={setOrdenUsuarios}
          abrirAltaUsuario={formularioUsuario.abrirAltaUsuario}
        />
      </div>

      <TarjetasResumenUsuarios usuarios={usuarios} />

      <div className="usuarios-panels-grid">
        <UsuariosHistorialAccesosPanel usuarios={usuarios} />
        <UsuariosSeguridadPanel usuarios={usuarios} />
      </div>

      {mensaje && <div className="success-message">{mensaje}</div>}

      {cargando && (
        <div className="info-message">Cargando usuarios...</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!cargando && !error && usuarios.length === 0 && (
        <EstadoVacio tipo="usuarios" titulo="No hay usuarios registrados" mensaje="Dales acceso al equipo para que gestionen el gimnasio." />
      )}

      {!cargando && !error && hayOcultos && (
        <EstadoVacio tipo="usuarios" titulo="Solo se muestran los usuarios activos" />
      )}

      {!cargando && !error && resultados.length === 0 && busqueda.length > 0 && (
        <EstadoVacio tipo="busqueda" titulo="Sin coincidencias" mensaje="Ningún usuario coincide con tu búsqueda." />
      )}

      {!cargando && !error && resultados.length > 0 && (
        <TablaUsuarios
          usuarios={resultadosOrdenados}
          roles={roles}
          miUsuarioId={miUsuarioId}
          alternarEstado={alternarEstado}
          cambiarRol={cambiarRol}
          resetearPassword={resetearPassword}
          desbloquear={desbloquear}
          eliminarUsuario={eliminarUsuario}
          verAuditoria={verAuditoria}
          editarUsuario={formularioUsuario.abrirEdicionUsuario}
          asignarClase={asignacion.abrirAsignacionClases}
        />
      )}

      <FormularioUsuarioModal
        {...formularioUsuario}
        roles={roles}
      />

      <AsignarClaseModal {...asignacion} />

      <AuditoriaUsuarioModal
        auditoria={auditoria}
        onClose={cerrarAuditoria}
      />
    </section>
  );
}

export default UsuariosSection;
