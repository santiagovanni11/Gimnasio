// =========================================================
// AVISO DE CHOQUE DE HORARIO
// Aviso reutilizable en inscripción simple y masiva: avisa
// que hay socios con otra clase el mismo día y hora y que
// por eso se los excluyó del listado seleccionable.
// =========================================================

function AvisoChoqueHorario({ idsConChoque = new Set() }) {
  if (!idsConChoque.size) return null;

  return (
    <p className="error-message">
      {idsConChoque.size > 1
        ? "Estos socios ya están inscriptos a otra clase el mismo día a la misma hora y se excluyeron del listado."
        : "Este socio ya está inscripto a otra clase el mismo día a la misma hora y se excluyó del listado."}
    </p>
  );
}

export default AvisoChoqueHorario;