// =========================================================
// RESUMEN OPERATIVO DE ASISTENCIAS
// KPIs compactos para controlar el día: presentes, ausentes,
// sin marcar y tasa general por clase/horario activo.
// =========================================================

function Card({ label, value, meta, tint = "neutral" }) {
  const colors = {
    success: { bg: "#173a2e", color: "#79f0b5" },
    danger: { bg: "#3b1d1d", color: "#ff9d9d" },
    warning: { bg: "#3a2d16", color: "#ffd77a" },
    neutral: { bg: "#1f2430", color: "#dfe7f3" },
  };

  return (
    <div className="panel-grid-item" style={{
      background: colors[tint].bg,
      color: colors[tint].color,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "14px 16px",
      minWidth: 150,
    }}>
      <small style={{ opacity: 0.8 }}>{label}</small>
      <div style={{ fontSize: 24, fontWeight: 700, margin: "8px 0 4px" }}>
        {value}
      </div>
      <small style={{ opacity: 0.8 }}>{meta}</small>
    </div>
  );
}

function AsistenciasResumenPanel({ resumen }) {
  const tasa = resumen.total > 0
    ? `${Math.round((resumen.presentes / resumen.total) * 100)}%`
    : "0%";

  return (
    <div className="panel-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 12,
      marginBottom: 18,
    }}>
      <Card label="Inscriptos" value={resumen.total} meta="total del día" tint="neutral" />
      <Card label="Presentes" value={resumen.presentes} meta="marcados OK" tint="success" />
      <Card label="Ausentes" value={resumen.ausentes} meta="faltantes" tint="danger" />
      <Card label="Sin marcar" value={resumen.sinMarcar} meta="pendientes" tint="warning" />
      <Card label="Tasa" value={tasa} meta={`${resumen.clases} clases`} tint="neutral" />
    </div>
  );
}

export default AsistenciasResumenPanel;
