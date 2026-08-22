// =========================================================
// CAMPO DE CONTRASEÑA CON VER/OCULTAR
// Mismo markup que AuthField (.input-group) + botón de
// visibilidad. Usado en el login.
// =========================================================

import { useState } from "react";

function CampoPassword({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group campo-password">
      <label>{label}</label>

      <div className="campo-password-control">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />

        <button
          type="button"
          className="campo-password-toggle"
          onClick={() => setVisible((antes) => !antes)}
          title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}

export default CampoPassword;
