function UsuariosSeguridadPanel({ usuarios = [] }) {
  const bloqueados = usuarios.filter((usuario) => {
    return usuario.bloqueadoHasta && new Date(usuario.bloqueadoHasta) > new Date();
  }).length;

  const pendientes = usuarios.filter((usuario) => usuario.activo === null || usuario.activo === undefined).length;
  const inactivos = usuarios.filter((usuario) => usuario.activo === false).length;
  const sinAcceso = usuarios.filter((usuario) => !usuario.ultimoAcceso && usuario.activo !== false).length;
  const fallidos = usuarios.filter((usuario) => Number(usuario.intentosFallidos ?? 0) >= 3).length;

  const estados = [
    { titulo: "Activos", valor: usuarios.filter((u) => u.activo !== false).length },
    { titulo: "Bloqueados", valor: bloqueados },
    { titulo: "Sin acceso", valor: sinAcceso },
    { titulo: "Fallidos", valor: fallidos },
  ];

  return (
    <div className="usuarios-panel">
      <div className="usuarios-panel-header">
        <div>
          <span className="panel-kicker">Seguridad</span>
          <h3>Estado real del usuario</h3>
        </div>
        <span className="panel-badge">{pendientes} pendientes</span>
      </div>

      <div className="usuarios-status-grid">
        {estados.map((estado) => (
          <div key={estado.titulo} className="usuarios-mini-stat">
            <span>{estado.titulo}</span>
            <strong>{estado.valor}</strong>
          </div>
        ))}
      </div>

      <ul className="usuarios-list-simple">
        <li>Activo, inactivo, pendiente, bloqueado y sin acceso.</li>
        <li>Revisión de activación y bloqueo por intentos fallidos.</li>
        <li>Forzar cambio de contraseña cuando se requiera.</li>
        <li>{inactivos} usuarios sin acceso operativo hoy.</li>
      </ul>
    </div>
  );
}

export default UsuariosSeguridadPanel;
