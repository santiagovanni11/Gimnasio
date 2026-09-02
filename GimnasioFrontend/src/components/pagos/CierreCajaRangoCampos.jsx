// =========================================================
// CAMPOS DE RANGO DEL CIERRE DE CAJA
// Presets rápidos (semana/meses) y selección desde/hasta.
// Pieza presentacional de CierreCajaModal.
// =========================================================

import { aISO, hoyISO, rangoMesActual, rangoMesAnterior } from "../../utils/fechas";

function CierreCajaRangoCampos({ rango, setRango }) {
  /** "Esta semana" necesita el lunes; se calcula al vuelo. */
  const presets = [
    { etiqueta: "Esta semana", rango: semanaActual(rango.hasta) },
    { etiqueta: "Este mes", rango: rangoMesActual() },
    { etiqueta: "Mes anterior", rango: rangoMesAnterior() },
  ];

  return (
    <>
      <div className="cierre-presets">
        {presets.map((preset) => (
          <button
            key={preset.etiqueta}
            type="button"
            className={
              esPresetActivo(rango, preset.rango)
                ? "primary-small-button"
                : "secondary-button"
            }
            onClick={() => setRango(preset.rango)}
          >
            {preset.etiqueta}
          </button>
        ))}
      </div>

      <div className="ticket-row">
        <span>Desde</span>
        <input
          type="date"
          className="input-fecha"
          value={rango.desde}
          max={rango.hasta}
          onChange={(e) =>
            setRango({ ...rango, desde: e.target.value })
          }
        />
      </div>

      <div className="ticket-row">
        <span>Hasta</span>
        <input
          type="date"
          className="input-fecha"
          value={rango.hasta}
          min={rango.desde}
          max={hoyISO()}
          onChange={(e) =>
            setRango({ ...rango, hasta: e.target.value })
          }
        />
      </div>
    </>
  );
}

/** Lunes de la semana del ISO dado -> ese día. */
function semanaActual(hastaISO) {
  const hasta = new Date(`${hastaISO}T12:00:00`);
  const diasDesdeLunes = (hasta.getDay() + 6) % 7;
  const lunes = new Date(hasta);
  lunes.setDate(hasta.getDate() - diasDesdeLunes);

  return { desde: aISO(lunes), hasta: hastaISO };
}

function esPresetActivo(rango, preset) {
  return rango.desde === preset.desde && rango.hasta === preset.hasta;
}

export default CierreCajaRangoCampos;
