function UsuariosHistorialAccesosPanel({ usuarios = [] }) {
  const historial = [...usuarios]
    .filter((usuario) => usuario.ultimoAcceso || usuario.fechaCreacion)
    .sort((a, b) => {
      const fechaA = a.ultimoAcceso ? new Date(a.ultimoAcceso).getTime() : 0;
      const fechaB = b.ultimoAcceso ? new Date(b.ultimoAcceso).getTime() : 0;
      return fechaB - fechaA;
    })
    .slice(0, 5);

  const sinAcceso = usuarios.filter((usuario) => !usuario.ultimoAcceso).length;

  const formatear = (valor) =>
    valor ? new Date(valor).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : "Sin acceso";

  return (
    <div className="usuarios-panel">
      <div className="usuarios-panel-header">
        <div>
          <span className="panel-kicker">Acceso</span>
          <h3>Historial de accesos</h3>
        </div>
        <span className="panel-badge">{sinAcceso} sin acceso</span>
      </div>

      <div className="usuarios-panel-body">
        {historial.length > 0 ? (
          historial.map((usuario) => {
            const nombre = [usuario.nombre, usuario.apellido]
              .filter(Boolean)
              .join(" ") || usuario.email;

            return (
              <div key={usuario.id} className="usuarios-panel-row">
                <div>
                  <strong>{nombre}</strong>
                  <small>{usuario.email}</small>
                </div>

                <div className="usuarios-panel-meta">
                  <span>Última sesión</span>
                  <strong>{formatear(usuario.ultimoAcceso)}</strong>
                </div>
              </div>
            );
          })
        ) : (
          <p className="usuarios-panel-empty">Sin actividad reciente.</p>
        )}
      </div>
    </div>
  );
}

export default UsuariosHistorialAccesosPanel;
