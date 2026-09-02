namespace GimnasioAPI.Settings;

/// <summary>
/// Nombres de roles del sistema y combinaciones de autorización
/// reutilizadas en toda la API. Única fuente de verdad: si un
/// rol cambia de nombre, se ajusta solo aquí.
/// </summary>
public static class RolesGimnasio
{
    public const string Administrador = "Administrador";
    public const string Recepcionista = "Recepcionista";
    public const string Profesor = "Profesor";

    /// <summary>Todos los roles operativos (consultas generales).</summary>
    public const string TodosLosRoles =
        "Administrador,Recepcionista,Profesor";

    /// <summary>Rol administrativo: gestiona operaciones diarias.</summary>
    public const string Administracion = "Administrador,Recepcionista";

    /// <summary>Roles admitidos en el registro público de cuentas.</summary>
    public static readonly string[] RegistroPermitido =
    {
        Administrador,
        Recepcionista,
        Profesor,
    };
}
