namespace GimnasioAPI.Models;

public class Empleado
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Apellido { get; set; } = string.Empty;

    public string DNI { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string TipoEmpleado { get; set; } = string.Empty;

    public DateTime FechaIngreso { get; set; } = DateTime.UtcNow;

    public bool Activo { get; set; } = true;

    public int? UsuarioId { get; set; }

    public Usuario? Usuario { get; set; }

    public ICollection<HorarioClase> Horarios { get; set; } = new List<HorarioClase>();
}