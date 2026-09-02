function UsuariosAccionesMasivasPanel({ usuarios = [] }) {
  const seleccionados = Math.min(usuarios.length, 8);

  return (
    <div className="usuarios-panel">
      <div className="usuarios-panel-header">
        <div>
          <span className="panel-kicker">Operativo</span>
          <h3>Acciones masivas</h3>
        </div>
        <span className="panel-badge">{seleccionados} seleccionados</span>
      </div>

      <div className="usuarios-mass-action">
        <select defaultValue="activar" className="rol-select">
          <option value="activar">Activar usuarios</option>
          <option value="desactivar">Desactivar usuarios</option>
          <option value="rol">Cambiar rol</option>
          <option value="exportar">Exportar listado</option>
        </select>

        <button type="button" className="primary-small-button">
          Aplicar
        </button>
      </div>

      <div className="usuarios-panel-summary">
        <span>Vinculación</span>
        <strong>{usuarios.filter((u) => u.rolNombre?.toLowerCase().includes("admin")).length} admins</strong>
      </div>

      <small className="usuarios-panel-note">
        Selección rápida para activar, desactivar, exportar o cambiar rol en lote.
      </small>
    </div>
  );
}

export default UsuariosAccionesMasivasPanel;
