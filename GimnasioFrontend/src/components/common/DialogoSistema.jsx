// =========================================================
// HOST DE DIÁLOGOS DEL SISTEMA
// Único punto visual que atiende las solicitudes de
// servicioDialogos (confirmaciones y textos) y las muestra
// como modales propios de la aplicación.
// =========================================================

import { useEffect, useRef, useState } from "react";
import { registrarManejadorDialogos } from "../../services/servicioDialogos";

function DialogoSistema() {
  const [dialogo, setDialogo] = useState(null);
  const [valor, setValor] = useState("");
  const [errorLocal, setErrorLocal] = useState("");
  const resolverRef = useRef(null);

  useEffect(
    () =>
      registrarManejadorDialogos((opciones) => {
        resolverRef.current = opciones.resolver;
        setValor(opciones.valorInicial ?? "");
        setErrorLocal("");
        setDialogo(opciones);
      }),
    []
  );

  // Escape cierra como cancelación.
  useEffect(() => {
    if (!dialogo) return undefined;

    const alTocarTecla = (evento) => {
      if (evento.key === "Escape") responder(null);
    };

    window.addEventListener("keydown", alTocarTecla);
    return () =>
      window.removeEventListener("keydown", alTocarTecla);
  }, [dialogo]);

  if (!dialogo) return null;

  /** Cierra resolviendo la promesa pendiente. */
  function responder(valor) {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    setDialogo(null);
    resolver?.(valor);
  }

  const esTexto = dialogo.tipo === "texto";

  function aceptar() {
    if (!esTexto) {
      responder(true);
      return;
    }

    const minimo = dialogo.minimoCaracteres ?? 0;
    const valorLimpio = valor.trim();

    if (valorLimpio.length < minimo) {
      setErrorLocal(
        `Ingresá al menos ${minimo} caracter${
          minimo !== 1 ? "es" : ""
        }.`
      );
      return;
    }

    responder(valorLimpio);
  }

  return (
    <div
      className="modal-sistema-velo dialogo-host"
      style={{ zIndex: 10000 }}
      onClick={() => responder(esTexto ? null : false)}
    >
      <div
        className="modal-sistema dialogo-sistema"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="form-card-header">
          <div>
            <span className="eyebrow">
              {dialogo.tono === "peligro" ? "ATENCIÓN" : "CONFIRMAR"}
            </span>

            <h3>{dialogo.titulo}</h3>
          </div>
        </div>

        {dialogo.mensaje && (
          <p className="dialogo-mensaje">{dialogo.mensaje}</p>
        )}

        {esTexto && (
          <div className="input-group">
            <input
              type={dialogo.tipoCampo ?? "text"}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={dialogo.placeholder ?? ""}
              autoFocus
            />

            {errorLocal && (
              <small className="error-message">{errorLocal}</small>
            )}
          </div>
        )}

        <div className="table-actions" style={{ marginTop: "14px" }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => responder(esTexto ? null : false)}
          >
            {dialogo.textoCancelar}
          </button>

          <button
            type="button"
            className={
              dialogo.tono === "peligro"
                ? "delete-button"
                : "primary-small-button"
            }
            onClick={aceptar}
            autoFocus={!esTexto}
          >
            {dialogo.textoAceptar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DialogoSistema;
