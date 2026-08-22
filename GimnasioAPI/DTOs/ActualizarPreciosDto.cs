namespace GimnasioAPI.DTOs;

public class ActualizarPreciosPlanDto
{
    public decimal Precio1Mes { get; set; }

    public decimal Precio3Meses { get; set; }

    public decimal Precio6Meses { get; set; }

    public decimal Precio12Meses { get; set; }

    /// <summary>
    /// Opcional: fecha desde la que rigen los nuevos precios.
    /// Si es futura, el cambio queda "Pendiente" hasta esa fecha.
    /// </summary>
    public DateTime? VigenteDesde { get; set; }
}