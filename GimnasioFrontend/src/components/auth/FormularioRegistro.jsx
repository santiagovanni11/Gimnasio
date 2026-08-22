// =========================================================
// FORMULARIO DE REGISTRO (público)
// Alta de cuenta con nombre, apellido y rol.
// =========================================================

import AuthField from "./AuthField";
import AuthMessage from "./AuthMessage";

function FormularioRegistro({ app }) {
  const {
    registroNombre,
    registroApellido,
    registroEmail,
    registroPassword,
    registroRolId,
    rolesRegistro,
    cargandoRoles,
    registrando,
    mensajeRegistro,
    errorRegistro,
    registrarCuenta,
    setRegistroNombre,
    setRegistroApellido,
    setRegistroEmail,
    setRegistroPassword,
    setRegistroRolId,
  } = app;

  return (
    <>
      <div className="login-title">
        <h2>Crear cuenta</h2>
        <p>
          Completá tus datos y elegí el tipo de cuenta que
          corresponde a tu función.
        </p>
      </div>

      <form onSubmit={registrarCuenta}>
        <AuthField
          label="Nombre"
          type="text"
          value={registroNombre}
          onChange={(event) => setRegistroNombre(event.target.value)}
          placeholder="Juan"
          autoComplete="given-name"
          maxLength={120}
          required
        />

        <AuthField
          label="Apellido"
          type="text"
          value={registroApellido}
          onChange={(event) =>
            setRegistroApellido(event.target.value)
          }
          placeholder="Pérez"
          autoComplete="family-name"
          maxLength={120}
          required
        />

        <AuthField
          label="Email"
          type="email"
          value={registroEmail}
          onChange={(event) => setRegistroEmail(event.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          required
        />

        <AuthField
          label="Contraseña"
          type="password"
          value={registroPassword}
          onChange={(event) => setRegistroPassword(event.target.value)}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          autoComplete="new-password"
          required
        />

        <AuthField
          label="Tipo de cuenta"
          type="select"
          value={registroRolId}
          onChange={(event) => setRegistroRolId(event.target.value)}
          disabled={cargandoRoles}
          required
        >
          <option value="">
            {cargandoRoles ? "Cargando..." : "Seleccioná un rol"}
          </option>
          {rolesRegistro.map((rolDisponible) => (
            <option key={rolDisponible.id} value={rolDisponible.id}>
              {rolDisponible.nombre}
            </option>
          ))}
        </AuthField>

        <AuthMessage type="success" message={mensajeRegistro} />
        <AuthMessage type="error" message={errorRegistro} />

        <button
          className="primary-button"
          type="submit"
          disabled={
            registrando || cargandoRoles || !registroRolId
          }
        >
          {registrando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <button
        type="button"
        className="secondary-button login-back-button"
        onClick={app.volverAlLogin}
      >
        Volver al inicio de sesión
      </button>
    </>
  );
}

export default FormularioRegistro;
