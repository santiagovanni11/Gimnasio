// SELECTOR DE MÉTODO DE PAGO PARA RENOVACIÓN AUTOMÁTICA
// Muestra las tarjetas del socio: primero las guardadas y, si no
// hay, las derivadas de sus pagos con tarjeta (que se auto-registran
// al elegirlas). Si ninguna existe, ofrece cargar una tarjeta.

import { useEffect, useMemo, useState } from "react";
import { metodosPagoService } from "../../services/metodosPagoService";
import { metodosDesdePagos } from "../../utils/pagosCheckout/metodosDesdePagos";

export default function SelectorMetodoPago({ socioId, metodoId, onChange, onMetodoSeleccionado, pagosDelSocio }) {
  const [metodos, setMetodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ marca: "Visa", ultimosCuatro: "", mesVencimiento: "", anioVencimiento: "" });

  useEffect(() => {
    if (!socioId) return;
    setCargando(true);
    metodosPagoService.obtener(socioId).then(({ datos }) => {
      setMetodos(Array.isArray(datos) ? datos : []);
      setCargando(false);
    }).catch(() => { setMetodos([]); setCargando(false); });
  }, [socioId]);

  const guardar = async (datosTarjeta) => {
    const { datos } = await metodosPagoService.crear({
      socioId, ...datosTarjeta,
      mesVencimiento: +datosTarjeta.mesVencimiento,
      anioVencimiento: +datosTarjeta.anioVencimiento,
    });
    setMetodos((prev) => [...prev, datos]);
    setMostrarForm(false);
    setNuevo({ marca: "Visa", ultimosCuatro: "", mesVencimiento: "", anioVencimiento: "" });
    onChange?.(datos.id);
    onMetodoSeleccionado?.();
  };

  const opciones = useMemo(() => {
    const clasesGuardadas = new Set(metodos.map((m) => `${m.marca}-${m.ultimosCuatro}`));
    const derivadas = metodosDesdePagos(pagosDelSocio)
      .filter((d) => !clasesGuardadas.has(`${d.marca}-${d.ultimosCuatro}`))
      .map((d, i) => ({ ...d, id: -(i + 1), derivada: true }));
    return [...metodos, ...derivadas];
  }, [metodos, pagosDelSocio]);

  const seleccionar = (valor) => {
    const id = Number(valor);
    const derivada = opciones.find((o) => o.id === id && o.derivada);
    if (derivada) {
      const { marca, ultimosCuatro, mesVencimiento, anioVencimiento } = derivada;
      guardar({ marca, ultimosCuatro, mesVencimiento, anioVencimiento });
      return;
    }

    onChange?.(id || null);
    if (id) onMetodoSeleccionado?.();
  };

  if (cargando) return <p className="campo-info">Cargando métodos de pago...</p>;

  const sinTarjetas = opciones.length === 0;

  return (
    <div className="input-group">
      <label>Método de pago para renovación</label>

      {!sinTarjetas ? (
        <>
          <select value={metodoId || ""} onChange={(e) => seleccionar(e.target.value)}>
            <option value="">Seleccionar tarjeta</option>
            {opciones.map((m) => (
              <option key={m.id} value={m.id}>{m.marca} ****{m.ultimosCuatro}</option>
            ))}
          </select>
          <button type="button" className="btn-texto" onClick={() => setMostrarForm((v) => !v)}>
            + Cargar otra tarjeta
          </button>
        </>
      ) : (
        <>
          <p className="campo-info campo-info--alerta">
            Este socio no tiene tarjetas registradas (por ejemplo, pagó en efectivo).
            Cargá una tarjeta de débito/crédito para habilitar la renovación automática.
          </p>
          <button type="button" className="btn-texto" onClick={() => setMostrarForm((v) => !v)}>
            + Cargar tarjeta de débito/crédito
          </button>
        </>
      )}

      {mostrarForm && (
        <div className="tarjeta-form">
          <select value={nuevo.marca} onChange={(e) => setNuevo({ ...nuevo, marca: e.target.value })}>
            <option>Visa</option><option>Mastercard</option><option>Amex</option>
          </select>
          <input placeholder="Últimos 4 dígitos" maxLength={4} value={nuevo.ultimosCuatro}
            onChange={(e) => setNuevo({ ...nuevo, ultimosCuatro: e.target.value.replace(/\D/g, "") })} />
          <div className="tarjeta-vencimiento">
            <select value={nuevo.mesVencimiento} onChange={(e) => setNuevo({ ...nuevo, mesVencimiento: e.target.value })}>
              <option value="">Mes</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select value={nuevo.anioVencimiento} onChange={(e) => setNuevo({ ...nuevo, anioVencimiento: e.target.value })}>
              <option value="">Año</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={2026 + i}>{2026 + i}</option>
              ))}
            </select>
          </div>
          <div className="tarjeta-acciones">
            <button type="button" className="btn-texto" onClick={() => guardar(nuevo)}>Guardar tarjeta</button>
            <button type="button" className="btn-texto-cancelar" onClick={() => setMostrarForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
