// =========================================================
// SIDEBAR — Navegación lateral agrupada y profesional.
// Mantiene la misma interfaz (rol, seccion, cambiarSeccion,
// permisos, cerrarSesion) para no romper DashboardPage.
// =========================================================

import { Logo, Logotipo } from "../../assets/Marca";
import {
  IconoInicio,
  IconoSocios,
  IconoMembresias,
  IconoPrecios,
  IconoUsuarios,
  IconoPagos,
  IconoClases,
  IconoAsistencias,
  IconoCerrarSesion,
} from "../../assets/Iconos";

const GRUPOS = [
  {
    titulo: "Panel",
    items: [{ id: "inicio", texto: "Inicio", icono: <IconoInicio /> }],
  },
  {
    titulo: "Operaciones",
    items: [
      { id: "socios", texto: "Socios", icono: <IconoSocios />, permiso: "puedeVerSocios" },
      { id: "membresias", texto: "Membresías", icono: <IconoMembresias />, permiso: "puedeVerMembresias" },
      { id: "clases", texto: "Clases", icono: <IconoClases />, permiso: "puedeVerClases" },
      { id: "asistencias", texto: "Asistencias", icono: <IconoAsistencias />, permiso: "puedeVerAsistencias" },
    ],
  },
  {
    titulo: "Finanzas",
    items: [
      { id: "pagos", texto: "Pagos", icono: <IconoPagos />, permiso: "puedeVerPagos" },
      { id: "precios", texto: "Planes y precios", icono: <IconoPrecios />, admin: true },
    ],
  },
  {
    titulo: "Sistema",
    items: [{ id: "usuarios", texto: "Usuarios", icono: <IconoUsuarios />, admin: true }],
  },
];

function Sidebar({ rol, seccion, cambiarSeccion, permisos, cerrarSesion }) {
  const esAdmin = rol === "Administrador";
  const visible = (item) =>
    item.admin ? esAdmin : item.permiso ? permisos[item.permiso] : true;

  return (
    <aside className="sidebar">
      <div className="sidebar-cabecera">
        <Logo size={42} />
        <div className="marca">
          <Logotipo size={19} />
          <span className="marca-sub">Centro de gestión</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {GRUPOS.map((grupo) => {
          const items = grupo.items.filter(visible);
          if (!items.length) return null;

          return (
            <div className="nav-grupo" key={grupo.titulo}>
              <span className="nav-grupo-titulo">{grupo.titulo}</span>
              {items.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className={`nav-item ${seccion === i.id ? "is-active" : ""}`}
                  onClick={() => cambiarSeccion(i.id)}
                >
                  <span className="nav-item-icon">{i.icono}</span>
                  <span className="nav-item-texto">{i.texto}</span>
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-pie">
        <div className="user-card">
          <div className="user-avatar">{rol.charAt(0).toUpperCase()}</div>
          <div className="user-meta">
            <span className="user-nombre">{rol}</span>
            <span className="user-sub">Sesión activa</span>
          </div>
        </div>

        <button type="button" className="nav-logout" onClick={cerrarSesion}>
          <IconoCerrarSesion width={18} height={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
