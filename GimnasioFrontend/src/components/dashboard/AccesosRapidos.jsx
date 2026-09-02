// AccesosRapidos — Acciones frecuentes desde el Inicio.
export default function AccesosRapidos({ acciones = [] }) {
  if (!acciones.length) return null;

  return (
    <section className="accesos-rapidos">
      {acciones.map(({ id, label, Icono, onClick }) => (
        <button key={id} type="button" className="acceso-boton" onClick={onClick}>
          <span className="acceso-icono">
            <Icono width={20} height={20} />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </section>
  );
}
