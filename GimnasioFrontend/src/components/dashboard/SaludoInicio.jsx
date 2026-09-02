// SaludoInicio — Bienvenida personalizada con rol, nombre y fecha.
export default function SaludoInicio({ rol = "", nombre = "", apellido = "" }) {
  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  const persona = [rol, nombre, apellido].filter(Boolean).join(" ");

  const fecha = new Date()
    .toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <section className="welcome-card">
      <div>
        <span className="eyebrow">SISTEMA DE GESTIÓN</span>
        <h2>{saludo}{persona ? `, ${persona}` : ""}.</h2>
        <p>
          {fecha} · Administrá tu gimnasio desde un solo lugar.
        </p>
      </div>
    </section>
  );
}
