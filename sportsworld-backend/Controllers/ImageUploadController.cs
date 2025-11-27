using Microsoft.AspNetCore.Mvc;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImageUploadController(IWebHostEnvironment webHostEnvironment) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Post(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }
            
            try
            { // TODO: Sjekke om file er null
            string webRootPath = webHostEnvironment.WebRootPath; // Stien til webAPIet
            string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            string absolutePath = Path.Combine( //Stien + mappen med bilder i API + navnet på opprettet fil
                webRootPath,
                "images",
                uniqueFileName 
                );

            using (var fileStream = new FileStream(absolutePath, FileMode.Create)) // Åpner og lukker filstrømmen
            {
                await file.CopyToAsync(fileStream); // Lagrer bilde fra frontend til images mappen
            }

            return Created(absolutePath, uniqueFileName); 
        }
        catch
        {
            return StatusCode(500);
        }

    }
}