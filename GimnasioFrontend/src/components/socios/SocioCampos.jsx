// =========================================================
// CAMPOS DEL SOCIO — Grilla de datos personales
// Texto simple (nombre/apellido) vía configuración; campos
// con formato propio (DNI, fecha, teléfono, email) y la
// dirección al final a lo ancho.
// =========================================================

const CAMPOS_TEXTO = [
  {
    name: "nombre",
    label: "Nombre *",
    placeholder: "Nombre",
    maxLength: 50,
    soloLetras: true,
    required: true,
  },
  {
    name: "apellido",
    label: "Apellido *",
    placeholder: "Apellido",
    maxLength: 50,
    soloLetras: true,
    required: true,
  },
];

function SocioCampos({
  nuevoSocio,
  manejarSoloLetras,
  manejarSoloNumeros,
  manejarCambioSocio,
}) {
  return (
    <div className="form-grid">
      {CAMPOS_TEXTO.map((campo) => (
        <CampoTexto key={campo.name} campo={campo} {...{ nuevoSocio, manejarSoloLetras, manejarCambioSocio }} />
      ))}

      <InputSocio
        label="DNI *"
        name="dni"
        valor={nuevoSocio.dni}
        placeholder="40111222"
        inputMode="numeric"
        maxLength={8}
        pattern="[0-9]{7,8}"
        title="El DNI debe contener entre 7 y 8 números."
        onNumeros={manejarSoloNumeros}
        required
      />

      <div className="input-group">
        <label>Fecha de nacimiento *</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={nuevoSocio.fechaNacimiento}
          onChange={manejarCambioSocio}
          required
        />
      </div>

      <InputSocio
        label="Teléfono *"
        name="telefono"
        tipo="tel"
        valor={nuevoSocio.telefono}
        placeholder="3415551234"
        inputMode="numeric"
        maxLength={15}
        pattern="[0-9]{8,15}"
        title="El teléfono debe contener entre 8 y 15 números."
        onNumeros={manejarSoloNumeros}
        required
      />

      <div className="input-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={nuevoSocio.email}
          onChange={manejarCambioSocio}
          placeholder="socio@email.com"
          required
        />
      </div>

      <div className="input-group full-width">
        <label>Dirección</label>
        <input
          type="text"
          name="direccion"
          value={nuevoSocio.direccion}
          onChange={manejarCambioSocio}
          placeholder="Ej. San Martín 1234"
          maxLength={100}
        />
      </div>
    </div>
  );
}

function CampoTexto({ campo, nuevoSocio, manejarSoloLetras, manejarCambioSocio }) {
  const onChange = campo.soloLetras
    ? (e) => manejarSoloLetras(e, campo.name)
    : manejarCambioSocio;

  const clase = campo.full ? "input-group full-width" : "input-group";

  return (
    <div className={clase}>
      <label>{campo.label}</label>

      <input
        type="text"
        name={campo.name}
        value={nuevoSocio[campo.name]}
        onChange={onChange}
        placeholder={campo.placeholder}
        maxLength={campo.maxLength}
        required={campo.required}
      />
    </div>
  );
}

function InputSocio({
  label, name, valor, tipo = "text",
  onNumeros, ...propsResto
}) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        type={tipo}
        name={name}
        value={valor}
        onChange={(e) => onNumeros(e, name)}
        {...propsResto}
      />
    </div>
  );
}

export default SocioCampos;
