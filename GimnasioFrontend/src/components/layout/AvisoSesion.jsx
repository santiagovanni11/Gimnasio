// =========================================================
// AVISO DE SESIÓN POR VENCER
// Banner sobre el contenido cuando quedan pocos minutos de
// JWT. El cálculo vive en useVigenciaSesion.
// =========================================================

function AvisoSesion({ debeAvisar, segundosRestantes }) {
  if (!debeAvisar) return null;

  const minutos = Math.max(
    1,
    Math.ceil(segundosRestantes / 60)
  );

  return (
    <div className="aviso-sesion" role="alert">
      <strong>Tu sesión está por vencer.</strong>
      <span>
        Vence en {minutos} minuto{minutos !== 1 ? "s" : ""}.
        Guardá tus cambios o volvé a iniciar sesión.
      </span>
    </div>
  );
}

export default AvisoSesion;
