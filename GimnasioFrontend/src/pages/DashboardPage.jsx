// =========================================================
// DASHBOARD — Página principal autenticada
// Compone layout y secciones; delega en useGymApp (app).
// =========================================================

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import AvisoSesion from "../components/layout/AvisoSesion";
import InicioSeccion from "../components/dashboard/InicioSeccion";
import PreciosSeccion from "../components/dashboard/PreciosSeccion";
import SociosSection from "../components/socios/SociosSection";
import MembresiasSection from "../components/membresias/MembresiasSection";
import PagosSection from "../components/pagos/PagosSection";
import UsuariosSection from "../components/usuarios/UsuariosSection";
import CambiarMiPasswordModal from "../components/usuarios/CambiarMiPasswordModal";
import { useUsuarios } from "../hooks/useUsuarios";
import { useMiCuenta } from "../hooks/useMiCuenta";
import { useVigenciaSesion } from "../hooks/useVigenciaSesion";
import { soloValidos } from "../utils/pagos";

export default function DashboardPage({ app }) {
  const {
    rol,
    mensaje,
    seccion,
    socios,
    membresias,
    membresiasRechazadasIds,
    pagos,
    cambiarSeccion,
    setMensaje,
    cerrarSesion,
    puedeVerSocios,
    puedeVerMembresias,
    puedeVerPagos,
    puedeVerClases,
    puedeVerAsistencias,
  } = app;

  // Gestión de usuarios: solo Administrador
  const gestionUsuarios = useUsuarios(
    rol === "Administrador" && seccion === "usuarios"
  );

  // Cambio de la propia contraseña (todos los roles)
  const miCuenta = useMiCuenta({ alGuardar: setMensaje });

  // Aviso de sesión por vencer + cierre automático al expirar
  const vigencia = useVigenciaSesion({
    activo: true,
    onExpirada: cerrarSesion,
  });

  const permisos = {
    puedeVerSocios,
    puedeVerMembresias,
    puedeVerPagos,
    puedeVerClases,
    puedeVerAsistencias,
  };

  const membresiasActivasCount = membresiasRechazadasIds
    ? membresias.filter(
        (m) => !membresiasRechazadasIds.has(Number(m.id))
      ).length
    : membresias.length;

  return (
    <div className="app-layout">
      <Sidebar
        rol={rol}
        seccion={seccion}
        cambiarSeccion={cambiarSeccion}
        permisos={permisos}
        setMensaje={setMensaje}
        cerrarSesion={cerrarSesion}
      />

      <main className="main-content">
        <AvisoSesion
          debeAvisar={vigencia.debeAvisar}
          segundosRestantes={vigencia.segundosRestantes}
        />

        <Topbar
          seccion={seccion}
          rol={rol}
          onAbrirMiCuenta={miCuenta.abrirMiCuenta}
        />

        {seccion === "inicio" && (
          <InicioSeccion
            mensaje={mensaje}
            sociosActivosCount={
              socios.filter((s) => s.activo !== false).length
            }
            membresiasActivasCount={membresiasActivasCount}
            pagosRegistradosCount={soloValidos(pagos).length}
          />
        )}

        {seccion === "socios" && <SociosSection {...app} />}

        {seccion === "membresias" && <MembresiasSection {...app} />}

        {seccion === "pagos" && <PagosSection {...app} />}

        {seccion === "usuarios" && (
          <UsuariosSection {...gestionUsuarios} />
        )}

        {seccion === "precios" && (
          <PreciosSeccion {...app} />
        )}

        <CambiarMiPasswordModal {...miCuenta} />
      </main>
    </div>
  );
}
