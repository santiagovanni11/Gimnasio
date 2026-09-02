// PanelSkeleton — Placeholder de carga para los paneles del Inicio.
export default function PanelSkeleton() {
  return (
    <div className="panel-inicio panel-skeleton" aria-hidden="true">
      <div className="skeleton-linea skeleton-titulo" />
      <div className="skeleton-linea" />
      <div className="skeleton-linea" />
      <div className="skeleton-linea" />
    </div>
  );
}
