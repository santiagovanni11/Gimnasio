// =========================================================
// SOCIOS — Sección principal
// Compone acciones, alertas, formulario, tabla y ficha.
// El ordenamiento vive en el hook useOrdenTabla.
// =========================================================

import { useMemo, useState } from "react";
import FormularioSocio from "./FormularioSocio";
import TablaSocios from "./TablaSocios";
import FichaSocioModal from "./FichaSocioModal";
import VencimientosAlert from "./VencimientosAlert";
import CumpleanosCard from "./CumpleanosCard";
import SociosAcciones from "./SociosAcciones";
import EstadosLista from "../common/EstadosLista";
import { useOrdenTabla } from "../../hooks/useOrdenTabla";
import {
  getCumpleanosDelMes,
  getVencimientosProximos,
  exportarSociosCsv,
} from "../../utils/socios";

function SociosSection(props) {
  const {
    busquedaSocio, setBusquedaSocio,
    puedeCrearSocios, puedeEditarSocios, puedeEliminarSocios,
    abrirFormularioSocio, mostrarFormularioSocio, socioEditando,
    cerrarFormularioSocio, nuevoSocio,
    manejarSoloLetras, manejarSoloNumeros, manejarCambioSocio,
    crearSocio, actualizarSocio,
    mensajeSocio, errorSocio, guardandoSocio,
    cargandoSocios, errorSocios,
    socios, sociosFiltrados, editarSocio, alternarEstadoSocio,
    membresias, membresiasRechazadasIds,
    pagos = [],
    verInactivos, setVerInactivos,
    abrirFormularioMembresiaDesdeSocio,
  } = props;

  const [socioConFicha, setSocioConFicha] = useState(null);
  const { orden, toggleOrden, ordenar } = useOrdenTabla("apellido");

  const cumpleanos = useMemo(() => getCumpleanosDelMes(socios), [socios]);

  const vencimientos = useMemo(
    () => getVencimientosProximos(membresias, membresiasRechazadasIds, 4),
    [membresias, membresiasRechazadasIds]
  );

  const sociosOrdenados = useMemo(
    () => ordenar(sociosFiltrados),
    [sociosFiltrados, ordenar]
  );

  return (
    <>
      <section className="content-card">
        <div className="section-header">
          <div>
            <h2>Listado de socios</h2>
            <p>Socios activos registrados en el gimnasio.</p>
          </div>

          <SociosAcciones
            busqueda={busquedaSocio}
            setBusqueda={setBusquedaSocio}
            verInactivos={verInactivos}
            setVerInactivos={setVerInactivos}
            puedeCrear={puedeCrearSocios}
            abrirFormulario={abrirFormularioSocio}
            exportar={() => exportarSociosCsv(sociosOrdenados)}
            hayDatos={sociosOrdenados.length > 0}
          />
        </div>

        <VencimientosAlert
          vencimientos={vencimientos} socios={socios} dias={4}
        />

        {cumpleanos.length > 0 && (
          <CumpleanosCard cumpleanos={cumpleanos} />
        )}

        {mostrarFormularioSocio && (
          <FormularioSocio
            socioEditando={socioEditando}
            cerrarFormularioSocio={cerrarFormularioSocio}
            nuevoSocio={nuevoSocio}
            manejarSoloLetras={manejarSoloLetras}
            manejarSoloNumeros={manejarSoloNumeros}
            manejarCambioSocio={manejarCambioSocio}
            crearSocio={crearSocio}
            actualizarSocio={actualizarSocio}
            mensajeSocio={mensajeSocio}
            errorSocio={errorSocio}
            guardandoSocio={guardandoSocio}
          />
        )}

        <EstadosLista
          cargando={cargandoSocios}
          error={errorSocios}
          total={socios.length}
          filtrados={sociosOrdenados.length}
          mensajeCargando="Cargando socios..."
          mensajeVacio="No hay socios registrados."
          mensajeSinResultado="No se encontraron socios con esa búsqueda."
        />

        {!cargandoSocios && !errorSocios && sociosOrdenados.length > 0 && (
          <TablaSocios
            socios={sociosOrdenados}
            orden={orden}
            toggleOrden={toggleOrden}
            puedeEditarSocios={puedeEditarSocios}
            puedeCrearSocios={puedeCrearSocios}
            puedeEliminarSocios={puedeEliminarSocios}
            editarSocio={editarSocio}
            alternarEstadoSocio={alternarEstadoSocio}
            abrirFormularioMembresiaDesdeSocio={abrirFormularioMembresiaDesdeSocio}
            verFicha={setSocioConFicha}
            membresias={membresias}
            membresiasRechazadasIds={membresiasRechazadasIds}
          />
        )}
      </section>

      <FichaSocioModal
        socio={socioConFicha}
        membresias={membresias}
        membresiasRechazadasIds={membresiasRechazadasIds}
        pagos={pagos}
        onClose={() => setSocioConFicha(null)}
      />
    </>
  );
}

export default SociosSection;
