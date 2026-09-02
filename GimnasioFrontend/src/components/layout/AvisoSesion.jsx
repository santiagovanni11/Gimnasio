function AvisoSesion({ debeAvisar, segundosRestantes }) {
  if (!debeAvisar) return null;

  const minutos = Math.max(1, Math.ceil((segundosRestantes || 60) / 60));

  return (
    <div className="aviso-sesion aviso-inactividad" role="alert">
      <strong>Tu sesión está por expirar por inactividad.</strong>
      <span>Volve a iniciar sesión para continuar.</span>
    </div>
  );
}

export default AvisoSesion;
