// =========================================================
// CONTENIDO DEL DASHBOARD
// Conmuta la sección activa. El shell (Sidebar/Topbar) vive
// en DashboardPage; acá solo se decide qué sección mostrar.
// =========================================================

import { useCallback, useEffect } from "react";
import AvisoSesion from "../layout/AvisoSesion";
import Topbar from "../layout/Topbar";
import InicioSeccion from "./InicioSeccion";
import PreciosSeccion from "./PreciosSeccion";
import SociosSection from "../socios/SociosSection";
import MembresiasSection from "../membresias/MembresiasSection";
import PagosSection from "../pagos/PagosSection";
import UsuariosSection from "../usuarios/UsuariosSection";
import ClasesSection from "../clases/ClasesSection";
import AsistenciasSection from "../asistencias/AsistenciasSection";
import CambiarMiPasswordModal from "../usuarios/CambiarMiPasswordModal";

function ContenidoDashboard({ app, dash }) {
  const { seccion, socios, membresias, pagos } = app;
  const {
    gestionUsuarios,
    gestionClases,
    gestionAsistencias,
    miCuenta,
    vigencia,
    permisos,
  } = dash;

  const refrescarInicio = useCallback(() => {
    app.obtenerSocios?.();
    app.obtenerMembresias?.();
    app.obtenerPagos?.();
  }, [app]);

  useEffect(() => {
    if (seccion === "inicio") {
      refrescarInicio();
    }
  }, [seccion, refrescarInicio]);

  return (
    <>
      <AvisoSesion
        debeAvisar={vigencia.debeAvisar}
        segundosRestantes={vigencia.segundosRestantes}
      />

      <Topbar
        seccion={seccion}
        rol={app.rol}
        onAbrirMiCuenta={miCuenta.abrirMiCuenta}
      />

      {seccion === "inicio" && (
        <InicioSeccion
          mensaje={app.mensaje}
          socios={socios}
          membresias={membresias}
          pagos={pagos}
          clases={gestionAsistencias.clases}
          horarios={gestionAsistencias.horarios}
          asistenciasHoy={gestionAsistencias.asistenciasDelDia}
          asistencias={gestionAsistencias.asistencias}
          inscripciones={gestionAsistencias.inscripciones}
          rol={app.rol}
          nombre={app.nombre}
          apellido={app.apellido}
          membresiasRechazadasIds={app.membresiasRechazadasIds}
          cargando={gestionAsistencias.cargando}
          permisos={permisos}
          onRefrescar={refrescarInicio}
          cambiarSeccion={app.cambiarSeccion}
        />
      )}

      {seccion === "socios" && <SociosSection {...app} />}

      {seccion === "membresias" && <MembresiasSection {...app} />}

      {seccion === "pagos" && <PagosSection {...app} />}

      {seccion === "usuarios" && <UsuariosSection {...gestionUsuarios} />}

      {seccion === "clases" && (
        <ClasesSection
          {...gestionClases}
          socios={socios}
          puedeGestionarClases={app.puedeGestionarClases}
          puedeEliminarClases={app.puedeEliminarClases}
          puedeGestionarHorarios={app.puedeGestionarHorarios}
        />
      )}

      {seccion === "asistencias" && (
        <AsistenciasSection
          {...gestionAsistencias}
          puedeEditarAsistencias={app.puedeEditarAsistencias}
        />
      )}

      {seccion === "precios" && <PreciosSeccion {...app} />}

      <CambiarMiPasswordModal {...miCuenta} />
    </>
  );
}

export default ContenidoDashboard;
