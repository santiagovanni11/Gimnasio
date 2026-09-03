namespace GimnasioAPI.Controllers;

using System.Net;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly CloudinaryService _cloudinary;
    private readonly IWebHostEnvironment _env;

    public UploadController(
        CloudinaryService cloudinary,
        IWebHostEnvironment env)
    {
        _cloudinary = cloudinary;
        _env = env;
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

        // En producción (Cloudinary configurado) subimos a la nube.
        if (_cloudinary.Configurado)
        {
            try
            {
                await using var stream = archivo.OpenReadStream();
                var url = await _cloudinary.SubirFotoAsync(
                    stream, archivo.FileName);

                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    (int)HttpStatusCode.InternalServerError,
                    $"No se pudo subir la imagen: {ex.Message}");
            }
        }

        // Modo local / de respaldo: guarda en wwwroot/uploads/fotos.
        var raiz = _env.WebRootPath
            ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var carpetaFotos = Path.Combine(raiz, "uploads", "fotos");
        Directory.CreateDirectory(carpetaFotos);

        var nombre = $"{Guid.NewGuid():N}{ext}";
        var ruta = Path.Combine(carpetaFotos, nombre);

        await using (var stream = new FileStream(ruta, FileMode.Create))
        {
            await archivo.CopyToAsync(stream);
        }

        return Ok(new { url = $"/uploads/fotos/{nombre}" });
    }
}
