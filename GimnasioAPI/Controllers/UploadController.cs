namespace GimnasioAPI.Controllers;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly string _carpetaFotos;

    public UploadController(IWebHostEnvironment env)
    {
        var raiz = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        _carpetaFotos = Path.Combine(raiz, "uploads", "fotos");
        Directory.CreateDirectory(_carpetaFotos);
    }

    [HttpPost("foto")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> SubirFoto(IFormFile archivo)
    {
        if (archivo is null || archivo.Length == 0)
            return BadRequest("No se envió ningún archivo.");

        var extensiones = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(archivo.FileName).ToLowerInvariant();

        if (!extensiones.Contains(ext))
            return BadRequest("Formato no permitido. Use JPG, PNG o WebP.");

        var nombre = $"{Guid.NewGuid():N}{ext}";
        var ruta = Path.Combine(_carpetaFotos, nombre);

        await using var stream = new FileStream(ruta, FileMode.Create);
        await archivo.CopyToAsync(stream);

        return Ok(new { url = $"/uploads/fotos/{nombre}" });
    }
}
