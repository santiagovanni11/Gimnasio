// =========================================================
// DASHBOARD — Página principal autenticada
// Arma el shell (Sidebar + Topbar) y deja la conmutación de
// secciones en ContenidoDashboard. Los proveedores por
// dominio se inicializan acá y se pasan ya resueltos.
// =========================================================

import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ContenidoDashboard from "../components/dashboard/ContenidoDashboard";
import { useUsuarios } from "../hooks/useUsuarios";
import { useClases } from "../hooks/useClases";
import { useAsistencias } from "../hooks/useAsistencias";
import { useMiCuenta } from "../hooks/useMiCuenta";
import { useInactividadSesion } from "../hooks/useInactividadSesion";

export default function DashboardPage({ app }) {
  const { rol, seccion, membresias, membresiasRechazadasIds } = app;
  const [menuAbierto, setMenuAbierto] = useState(false);
  const alternarMenu = () => setMenuAbierto((v) => !v);
  const cerrarMenu = () => setMenuAbierto(false);

  const gestionUsuarios = useUsuarios(
    rol === "Administrador" && seccion === "usuarios"
  );

  const gestionClases = useClases({
    activo: seccion === "clases",
    onSesionExpirada: app.cerrarSesion,
  });

  const gestionAsistencias = useAsistencias({
    activo: true,
    onSesionExpirada: app.cerrarSesion,
  });

  const miCuenta = useMiCuenta({
    alGuardar: app.setMensaje,
    onSesionExpirada: app.cerrarSesion,
  });

  const vigencia = useInactividadSesion({
    onInactividad: app.cerrarSesion,
  });

  const permisos = {
    puedeVerSocios: app.puedeVerSocios,
    puedeVerMembresias: app.puedeVerMembresias,
    puedeVerPagos: app.puedeVerPagos,
    puedeVerClases: app.puedeVerClases,
    puedeVerAsistencias: app.puedeVerAsistencias,
  };

  const membresiasActivasCount = membresiasRechazadasIds
    ? membresias.filter((m) => !membresiasRechazadasIds.has(Number(m.id))).length
    : membresias.length;

  return (
    <div className="app-layout">
      {menuAbierto && (
        <button
          type="button"
          className="sidebar-velo"
          onClick={cerrarMenu}
          aria-label="Cerrar menú"
        />
      )}

      <Sidebar
        rol={rol}
        seccion={seccion}
        abierto={menuAbierto}
        cambiarSeccion={app.cambiarSeccion}
        permisos={permisos}
        cerrarSesion={app.cerrarSesion}
        onNavegar={cerrarMenu}
      />

      <main className="main-content">
        <ContenidoDashboard
          app={app}
          dash={{
            gestionUsuarios,
            gestionClases,
            gestionAsistencias,
            miCuenta,
            vigencia,
            permisos,
            membresiasActivasCount,
            menuAbierto,
            onToggleMenu: alternarMenu,
          }}
        />
      </main>
    </div>
  );
}
