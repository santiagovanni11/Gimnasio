function ClasesResumenPanel({ resumen = {} }) {
  const cards = [
    { titulo: "Total", valor: resumen.total ?? 0, nota: "clases" },
    { titulo: "Activas", valor: resumen.activas ?? 0, nota: "disponibles" },
    { titulo: "Horarios", valor: resumen.horariosActivos ?? 0, nota: "franjas" },
    { titulo: "Llenos", valor: resumen.cuposLlenos ?? 0, nota: "cupo completo" },
  ];

  return (
    <section className="clases-summary-grid">
      {cards.map((card) => (
        <div key={card.titulo} className="clases-summary-card">
          <span>{card.titulo}</span>
          <strong>{card.valor}</strong>
          <small>{card.nota}</small>
        </div>
      ))}
    </section>
  );
}

export default ClasesResumenPanel;
