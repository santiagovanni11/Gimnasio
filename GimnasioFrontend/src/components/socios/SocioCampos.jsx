// CAMPOS DEL SOCIO — Grilla de datos personales + emergencia + foto

import { useRef, useState } from "react";
import { subirFoto } from "../../services/uploadService";

const CAMPOS_TEXTO = [
  { name: "nombre", label: "Nombre *", placeholder: "Nombre", maxLength: 50, soloLetras: true, required: true },
  { name: "apellido", label: "Apellido *", placeholder: "Apellido", maxLength: 50, soloLetras: true, required: true },
];

function CampoFoto({ valor, onChange }) {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const handleArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError(null);
    setSubiendo(true);
    try {
      const { url } = await subirFoto(archivo);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="input-group full-width">
      <label>Foto del socio</label>
      <div className="campo-foto">
        {valor ? (
          <div className="foto-preview">
            <img src={valor} alt="Vista previa" />
            <button type="button" className="btn-quitar-foto" onClick={() => onChange(null)}>✕</button>
          </div>
        ) : (
          <button type="button" className="btn-cargar-foto" onClick={() => inputRef.current?.click()} disabled={subiendo}>
            {subiendo ? "Subiendo..." : "Cargar foto"}
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleArchivo} hidden />
        {error && <span className="campo-foto-error">{error}</span>}
      </div>
    </div>
  );
}

function SocioCampos({ nuevoSocio, manejarSoloLetras, manejarSoloNumeros, manejarCambioSocio }) {
  return (
    <div className="form-grid">
      {CAMPOS_TEXTO.map((campo) => (
        <CampoTexto key={campo.name} campo={campo} {...{ nuevoSocio, manejarSoloLetras, manejarCambioSocio }} />
      ))}

      <InputSocio label="DNI *" name="dni" valor={nuevoSocio.dni} placeholder="40111222"
        inputMode="numeric" maxLength={8} pattern="[0-9]{7,8}"
        title="El DNI debe contener entre 7 y 8 números." onNumeros={manejarSoloNumeros} required />

      <div className="input-group">
        <label>Fecha de nacimiento *</label>
        <input type="date" name="fechaNacimiento" value={nuevoSocio.fechaNacimiento}
          onChange={manejarCambioSocio} required />
      </div>

      <InputSocio label="Teléfono *" name="telefono" tipo="tel" valor={nuevoSocio.telefono}
        placeholder="3415551234" inputMode="numeric" maxLength={15}
        pattern="[0-9]{8,15}" title="El teléfono debe contener entre 8 y 15 números."
        onNumeros={manejarSoloNumeros} required />

      <div className="input-group">
        <label>Email *</label>
        <input type="email" name="email" value={nuevoSocio.email}
          onChange={manejarCambioSocio} placeholder="socio@email.com" required />
      </div>

      <div className="input-group full-width">
        <label>Dirección</label>
        <input type="text" name="direccion" value={nuevoSocio.direccion}
          onChange={manejarCambioSocio} placeholder="Ej. San Martín 1234" maxLength={100} />
      </div>

      <CampoFoto valor={nuevoSocio.fotoUrl} onChange={(url) => manejarCambioSocio({ target: { name: "fotoUrl", value: url } })} />

      <div className="input-group">
        <label>Contacto de emergencia</label>
        <input type="text" name="contactoEmergencia" value={nuevoSocio.contactoEmergencia || ""}
          onChange={manejarCambioSocio} placeholder="Nombre del contacto" maxLength={120} />
      </div>

      <div className="input-group">
        <label>Tel. emergencia</label>
        <input type="tel" name="telefonoEmergencia" value={nuevoSocio.telefonoEmergencia || ""}
          onChange={(e) => manejarSoloNumeros(e, "telefonoEmergencia")} placeholder="3415551234"
          inputMode="numeric" maxLength={15} />
      </div>
    </div>
  );
}

function CampoTexto({ campo, nuevoSocio, manejarSoloLetras, manejarCambioSocio }) {
  const onChange = campo.soloLetras ? (e) => manejarSoloLetras(e, campo.name) : manejarCambioSocio;
  return (
    <div className="input-group">
      <label>{campo.label}</label>
      <input type="text" name={campo.name} value={nuevoSocio[campo.name]}
        onChange={onChange} placeholder={campo.placeholder} maxLength={campo.maxLength}
        required={campo.required} />
    </div>
  );
}

function InputSocio({ label, name, valor, tipo = "text", onNumeros, ...propsResto }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={tipo} name={name} value={valor} onChange={(e) => onNumeros(e, name)} {...propsResto} />
    </div>
  );
}

export default SocioCampos;
