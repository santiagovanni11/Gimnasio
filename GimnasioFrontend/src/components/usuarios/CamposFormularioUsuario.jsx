// =========================================================
// CAMPOS DEL FORMULARIO DE USUARIO (presentacional)
// Recibe el estado del formulario y lo pinta; la lógica de
// estado vive en useFormularioUsuario.
// =========================================================

function CamposFormularioUsuario({
  camposUsuario,
  cambiarCampoUsuario,
  roles,
  enEdicion,
  errorUsuario,
}) {
  return (
    <div className="payment-ticket-body">
      <div className="input-group">
        <label>Nombre</label>
        <input
          type="text"
          value={camposUsuario.nombre}
          onChange={(e) => cambiarCampoUsuario("nombre", e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="input-group">
        <label>Apellido</label>
        <input
          type="text"
          value={camposUsuario.apellido}
          onChange={(e) => cambiarCampoUsuario("apellido", e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          value={camposUsuario.email}
          onChange={(e) => cambiarCampoUsuario("email", e.target.value)}
          maxLength={150}
          required
          autoFocus={!enEdicion}
        />
      </div>

      <div className="input-group">
        <label>Rol</label>
        <select
          value={camposUsuario.rolId}
          onChange={(e) => cambiarCampoUsuario("rolId", e.target.value)}
          required
        >
          <option value="" disabled>
            Seleccioná un rol…
          </option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      {!enEdicion && (
        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            autoComplete="new-password"
            value={camposUsuario.password}
            onChange={(e) => cambiarCampoUsuario("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>
      )}

      {errorUsuario && <p className="error-message">{errorUsuario}</p>}
    </div>
  );
}

export default CamposFormularioUsuario;
