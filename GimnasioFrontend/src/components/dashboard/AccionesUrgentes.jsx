// AccionesUrgentes — resumen rápido de lo que necesita atención hoy.
export default function AccionesUrgentes({
  pendientes = 0,
  vencenHoy = 0,
  inscriptos = 0,
  onCobrar,
  onAsistencias,
}) {
  const items = [
    { label: "Cobros pendientes", valor: pendientes, meta: "requieren seguimiento" },
    { label: "Vencen hoy", valor: vencenHoy, meta: "membresías por renovar" },
    { label: "Socios en clases", valor: inscriptos, meta: "inscriptos del día" },
  ];

  return (
    <div className="panel-inicio">
      <div className="panel-inicio-cabecera">
        <h3>Resumen operativo</h3>
        <span className="panel-inicio-contador">{items.reduce((sum, item) => sum + item.valor, 0)}</span>
      </div>

      <ul className="alerta-lista">
        {items.map((item) => (
          <li key={item.label} className="alerta-item">
            <div>
              <span className="alerta-nombre">{item.label}</span>
              <span className="alerta-sub">{item.meta}</span>
            </div>
            <strong>{item.valor}</strong>
          </li>
        ))}
      </ul>

      <button type="button" className="panel-inicio-pie" onClick={onCobrar}>Ver pagos</button>
      <button type="button" className="panel-inicio-pie" onClick={onAsistencias}>Ver asistencias</button>
    </div>
  );
}
