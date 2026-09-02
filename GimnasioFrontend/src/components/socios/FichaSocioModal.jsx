// FICHA DEL SOCIO — Modal con datos, membresía, emergencia, asistencias e historial

import { useEffect, useState } from "react";
import { totalAprobadoPorMembresia } from "../../utils/pagos";
import { estadoMembresiaTexto } from "../../utils/membresias";
import { camposFaltantesDe, getMembresiaVisual } from "../../utils/socios";
import { fechaTexto as fecha } from "../../utils/fechas";
import { descargarFichaSocioPdf } from "../../utils/exportar/fichaSocioExportarPdf";
import { sociosService } from "../../services/sociosService";
import HistorialPagosTabla from "./HistorialPagosTabla";
import HistorialMembresiasTabla from "./HistorialMembresiasTabla";
import { Dato, Encabezado, ResumenMembresia } from "./FichaSocioPiezas";
import SociosNotas from "./SociosNotas";
import SociosHistorial from "./SociosHistorial";

const moneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function FichaSocioModal({ socio, membresias = [], membresiasRechazadasIds, pagos = [], onClose }) {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    if (!socio?.id) return;
    sociosService.obtenerAsistenciasSocio(socio.id, 10).then(setAsistencias).catch(() => setAsistencias([]));
  }, [socio?.id]);

  if (!socio) return null;

  const membresiasDelSocio = membresias.filter((m) => Number(m.socioId) === Number(socio.id));
  const faltantes = camposFaltantesDe(socio);
  const visual = getMembresiaVisual(socio, membresias, membresiasRechazadasIds);
  const pagosDelSocio = pagos.filter((p) => Number(p.socioId) === Number(socio.id))
    .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));
  const membresiaValida = visual.membresia;
  const pagado = membresiaValida ? totalAprobadoPorMembresia(pagos).get(Number(membresiaValida.id)) || 0 : 0;
  const historial = membresiasDelSocio.map((m) => ({
    ...m, estadoTexto: membresiasRechazadasIds?.has(Number(m.id)) ? "Rechazada" : estadoMembresiaTexto(m.estado),
  }));
  const tieneEmergencia = socio.contactoEmergencia || socio.telefonoEmergencia;
  const ultimaCuota = pagosDelSocio.find((pago) => Number(pago.estado) === 2) || pagosDelSocio[0];
  const deuda = membresiasDelSocio.reduce((total, membresia) => {
    const monto = Number(membresia.precioAplicado || 0);
    const pagadoActual = pagosDelSocio
      .filter((pago) => Number(pago.membresiaId) === Number(membresia.id) && Number(pago.estado) === 2)
      .reduce((sum, pago) => sum + Number(pago.monto || 0), 0);
    return total + Math.max(monto - pagadoActual, 0);
  }, 0);

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div className="payment-modal payment-modal-detail" onClick={(e) => e.stopPropagation()}>
        <Encabezado socio={socio} onClose={onClose} />
        <div className="payment-ticket-body">
          <h4>Datos personales</h4>
          <Dato etiqueta="DNI" valor={socio.dni} />
          <Dato etiqueta="Teléfono" valor={socio.telefono} />
          <Dato etiqueta="Email" valor={socio.email} />
          <Dato etiqueta="Dirección" valor={socio.direccion} />
          <Dato etiqueta="Fecha de nacimiento" valor={fecha(socio.fechaNacimiento)} />
          <Dato etiqueta="Alta" valor={fecha(socio.fechaAlta)} />
          {faltantes.length > 0 && (
            <div className="ticket-row">
              <span>Datos incompletos</span>
              <strong><span className="status-warning">Falta: {faltantes.join(", ")}</span></strong>
            </div>
          )}

          {tieneEmergencia && (
            <>
              <h4>Contacto de emergencia</h4>
              <Dato etiqueta="Nombre" valor={socio.contactoEmergencia} />
              <Dato etiqueta="Teléfono" valor={socio.telefonoEmergencia} />
            </>
          )}

          <h4>Membresía actual</h4>
          <div className="ticket-row">
            <span>Estado</span>
            <strong><span className={visual.clase}>{visual.texto}</span></strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem", margin: "0.75rem 0" }}>
            <div className="ticket-row"><span>Última cuota</span><strong>{ultimaCuota ? moneda.format(Number(ultimaCuota.monto || 0)) : "$0"}</strong></div>
            <div className="ticket-row"><span>Deuda</span><strong>{moneda.format(deuda)}</strong></div>
            <div className="ticket-row"><span>Próximo vencimiento</span><strong>{fecha(visual.fechaFin)}</strong></div>
            <div className="ticket-row"><span>Membresía</span><strong>{visual.membresia?.planNombre || "-"}</strong></div>
          </div>
          <ResumenMembresia visual={visual} pagado={pagado} />

          <SociosNotas socioId={socio.id} />
          <SociosHistorial socioId={socio.id} />

          {asistencias.length > 0 && (
            <>
              <h4>Últimas asistencias ({asistencias.length})</h4>
              <div className="tabla-simple">
                <table>
                  <thead><tr><th>Fecha</th><th>Clase</th><th>Estado</th></tr></thead>
                  <tbody>
                    {asistencias.map((a) => (
                      <tr key={a.id}>
                        <td>{fecha(a.fecha)}</td>
                        <td>{a.claseNombre || "General"}</td>
                        <td><span className={a.presente ? "status-active" : "status-inactive"}>
                          {a.presente ? "Presente" : "Ausente"}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <h4>Historial de membresías ({historial.length})</h4>
          <HistorialMembresiasTabla membresias={historial} />
          <h4>Pagos ({pagosDelSocio.length})</h4>
          <HistorialPagosTabla pagos={pagosDelSocio} />
        </div>

        <div className="payment-modal-actions">
          <button type="button" className="secondary-button" onClick={() => descargarFichaSocioPdf({ socio, visual, pagado, faltantes, historial, pagosDelSocio })}>
            Descargar PDF
          </button>
          <button type="button" className="primary-small-button" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default FichaSocioModal;
