// SOCIOS — Sección principal: filtros, alertas, tabla, ficha,
// estadísticas e importación masiva.
import { useMemo, useState } from "react";
import FormularioSocio from "./FormularioSocio";
import TablaSocios from "./TablaSocios";
import FichaSocioModal from "./FichaSocioModal";
import VencimientosAlert from "./VencimientosAlert";
import CumpleanosCard from "./CumpleanosCard";
import SociosAcciones from "./SociosAcciones";
import SociosFiltros from "./SociosFiltros";
import InscripcionClaseModal from "./InscripcionClaseModal";
import SociosImportacion from "./SociosImportacion";
import EstadisticasSocios from "./EstadisticasSocios";
import EstadosLista from "../common/EstadosLista";
import { useOrdenTabla } from "../../hooks/useOrdenTabla";
import { useFiltrosSocios } from "../../hooks/useFiltrosSocios";
import { useInscripcionDesdeSocio } from "../../hooks/useInscripcionDesdeSocio";
import {
  getCumpleanosDelMes,
  getVencimientosProximos,
} from "../../utils/socios";
import { exportarSociosCsv } from "../../utils/exportar/sociosExportarCsv";
function SociosSection(props) {
  const {
    busquedaSocio, setBusquedaSocio,
    puedeCrearSocios, puedeEditarSocios,
    abrirFormularioSocio, mostrarFormularioSocio, socioEditando,
    cerrarFormularioSocio, nuevoSocio,
    manejarSoloLetras, manejarSoloNumeros, manejarCambioSocio,
    crearSocio, actualizarSocio, mensajeSocio, errorSocio, guardandoSocio,
    cargandoSocios, errorSocios,
    socios, sociosFiltrados, editarSocio, alternarEstadoSocio,
    obtenerSocios,
    membresias, membresiasRechazadasIds,
    pagos = [], mostrarTodos, setMostrarTodos,
    abrirFormularioMembresiaDesdeSocio, setMensaje, cerrarSesion,
  } = props;
  const [socioConFicha, setSocioConFicha] = useState(null);
  const [importando, setImportando] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const { orden, toggleOrden, ordenar } = useOrdenTabla("apellido");
  const inscripcionClase = useInscripcionDesdeSocio({
    onSesionExpirada: cerrarSesion,
    notificar: setMensaje,
  });
  const {
    filtroMembresia,
    setFiltroMembresia,
    soloMorosos,
    setSoloMorosos,
    filtroEstadoMembresia,
    setFiltroEstadoMembresia,
    filtroEstadoSocio,
    setFiltroEstadoSocio,
    sociosVisibles,
  } = useFiltrosSocios({
    sociosFiltrados,
    pagos,
    membresias,
    rechazadasIds: membresiasRechazadasIds,
  });
  const cumpleanos = useMemo(() => getCumpleanosDelMes(socios), [socios]);

  const vencimientos = useMemo(
    () => getVencimientosProximos(membresias, membresiasRechazadasIds, 4),
      [membresias, membresiasRechazadasIds]
  );
  const sociosOrdenados = useMemo(
    () => ordenar(sociosVisibles),
    [sociosVisibles, ordenar]
  );

  const toggleSeleccionado = (socioId) => {
    const id = Number(socioId);
    setSeleccionados((anterior) =>
      anterior.includes(id)
        ? anterior.filter((valor) => valor !== id)
        : [...anterior, id]
    );
  };

  const toggleSeleccionTodos = () => {
    const ids = sociosOrdenados.map((socio) => Number(socio.id));
    setSeleccionados((anterior) => {
      const conjunto = new Set(anterior);
      return ids.every((id) => conjunto.has(id))
        ? anterior.filter((id) => !ids.includes(id))
        : [...new Set([...anterior, ...ids])];
    });
  };

  const desactivarSeleccionados = async () => {
    const lista = sociosOrdenados.filter((socio) =>
      seleccionados.includes(Number(socio.id))
    );

    for (const socio of lista) {
      if (socio.activo !== false) {
        await alternarEstadoSocio(socio);
      }
    }

    setSeleccionados([]);
  };

  const exportarSeleccionados = () => {
    const lista = sociosOrdenados.filter((socio) =>
      seleccionados.includes(Number(socio.id))
    );

    if (!lista.length) return;
    exportarSociosCsv(lista);
  };

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
            mostrarTodos={mostrarTodos}
            setMostrarTodos={setMostrarTodos}
            puedeCrear={puedeCrearSocios}
            abrirFormulario={abrirFormularioSocio}
            exportar={() => exportarSociosCsv(sociosOrdenados)}
            hayDatos={sociosOrdenados.length > 0}
            abrirImportar={() => setImportando(true)}
            seleccionados={seleccionados}
            onToggleTodo={toggleSeleccionTodos}
            onBajaMasiva={desactivarSeleccionados}
            onExportarSeleccionados={exportarSeleccionados}
          />
        </div>
        <EstadisticasSocios />
      </section>

      <section className="content-card">
        <SociosFiltros
          filtroMembresia={filtroMembresia}
          setFiltroMembresia={setFiltroMembresia}
          soloMorosos={soloMorosos}
          setSoloMorosos={setSoloMorosos}
          filtroEstadoMembresia={filtroEstadoMembresia}
          setFiltroEstadoMembresia={setFiltroEstadoMembresia}
          filtroEstadoSocio={filtroEstadoSocio}
          setFiltroEstadoSocio={setFiltroEstadoSocio}
        />

        <VencimientosAlert vencimientos={vencimientos} socios={socios} dias={4} />

        {cumpleanos.length > 0 && <CumpleanosCard cumpleanos={cumpleanos} />}

        {mostrarFormularioSocio && (
          <FormularioSocio
            socioEditando={socioEditando} cerrarFormularioSocio={cerrarFormularioSocio}
            nuevoSocio={nuevoSocio} manejarSoloLetras={manejarSoloLetras}
            manejarSoloNumeros={manejarSoloNumeros} manejarCambioSocio={manejarCambioSocio}
            crearSocio={crearSocio} actualizarSocio={actualizarSocio}
            mensajeSocio={mensajeSocio} errorSocio={errorSocio} guardandoSocio={guardandoSocio} />
        )}

        <EstadosLista
          cargando={cargandoSocios} error={errorSocios}
          total={socios.length} filtrados={sociosOrdenados.length}
          mensajeCargando="Cargando socios..."
          mensajeVacio="No hay socios registrados."
          mensajeSinResultado="No se encontraron socios con esa búsqueda." />

        {!cargandoSocios && !errorSocios && sociosOrdenados.length > 0 && (
          <TablaSocios
            socios={sociosOrdenados}
            orden={orden}
            toggleOrden={toggleOrden}
            puedeEditarSocios={puedeEditarSocios}
            puedeCrearSocios={puedeCrearSocios}
            editarSocio={editarSocio}
            alternarEstadoSocio={alternarEstadoSocio}
            abrirFormularioMembresiaDesdeSocio={abrirFormularioMembresiaDesdeSocio}
            verFicha={setSocioConFicha}
            inscribirEnClases={inscripcionClase.abrirInscripcionClases}
            membresias={membresias}
            membresiasRechazadasIds={membresiasRechazadasIds}
            selectedIds={seleccionados}
            onToggleSeleccion={toggleSeleccionado}
          />
        )}
      </section>

      <FichaSocioModal socio={socioConFicha} membresias={membresias}
        membresiasRechazadasIds={membresiasRechazadasIds}
        pagos={pagos} onClose={() => setSocioConFicha(null)} />

      <InscripcionClaseModal {...inscripcionClase} />

      <SociosImportacion abierto={importando}
        cerrar={() => setImportando(false)} recargar={obtenerSocios} />
    </>
  );
}

export default SociosSection;
