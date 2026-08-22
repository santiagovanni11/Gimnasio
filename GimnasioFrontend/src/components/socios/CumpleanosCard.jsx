// =========================================================
// CUMPLEAÑOS DEL MES — Tarjeta informativa de Socios
// =========================================================

function CumpleanosCard({ cumpleanos }) {
  return (
    <div className="form-card" style={{ marginBottom: "1rem" }}>
      <div className="form-card-header">
        <div>
          <h3>Cumpleaños de este mes</h3>
          <p>{cumpleanos.length} socio(s) cumplen años.</p>
        </div>
      </div>

      <div className="payment-breakdown-list">
        {cumpleanos.map((socio) => {
          const nacimiento = new Date(socio.fechaNacimiento);

          return (
            <div className="payment-breakdown-row" key={socio.id}>
              <div className="payment-breakdown-info">
                <span className="payment-breakdown-name">
                  {socio.nombre} {socio.apellido}
                </span>

                <span className="payment-breakdown-count">
                  {nacimiento.getDate()} de{" "}
                  {nacimiento.toLocaleDateString("es-AR", {
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CumpleanosCard;
