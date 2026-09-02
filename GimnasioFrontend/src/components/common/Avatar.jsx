// =========================================================
// Avatar.jsx — Foto de perfil o iniciales con gradiente
// Si el socio tiene FotoUrl muestra la imagen; si no, iniciales.
// =========================================================

function iniciales(nombre, apellido, email) {
  const base = `${nombre || ""} ${apellido || ""}`.trim();
  if (base) {
    const partes = base.split(/\s+/);
    return (partes[0][0] + (partes[1]?.[0] ?? "")).toUpperCase();
  }
  return (email || "?").trim().charAt(0).toUpperCase();
}

function colorDesde(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  const matiz = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${matiz} 55% 42%), hsl(${(matiz + 40) % 360} 60% 32%))`;
}

function Avatar({ nombre, apellido, email, fotoUrl, size = 38 }) {
  if (fotoUrl) {
    return (
      <img
        className="avatar-dm avatar-foto"
        src={fotoUrl}
        alt={`${nombre || ""} ${apellido || ""}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const texto = `${nombre || ""} ${apellido || ""} ${email || ""}`.trim();
  return (
    <span
      className="avatar-dm"
      style={{
        width: size,
        height: size,
        background: colorDesde(texto),
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {iniciales(nombre, apellido, email)}
    </span>
  );
}

export default Avatar;
