using Microsoft.AspNetCore.Mvc;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VenueImageUploadController(IWebHostEnvironment webHostEnvironment) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Post(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }
        try
        {
            string webRootPath = webHostEnvironment.WebRootPath; 
            string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            //Stien + mappen med bilder i API + navnet på opprettet fil
            string absolutePath = Path.Combine
            ( 
                webRootPath,
                "images",
                "VenueImages",
                uniqueFileName 
            );

            // Åpner og lukker filstrømmen
            using (var fileStream = new FileStream(absolutePath, FileMode.Create)) 
            {
                // Lagrer bilde fra frontend til images mappen
                await file.CopyToAsync(fileStream); 
            }
            return Created(absolutePath, uniqueFileName); 
        }
        catch
        {
            return StatusCode(500);
        }

    }
}