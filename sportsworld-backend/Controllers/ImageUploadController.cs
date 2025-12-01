using Microsoft.AspNetCore.Mvc;

namespace sportsworld_backend.Controllers;

//Kontroller for opplastning av bilder til Athlete og Finance tabellene

[ApiController]
[Route("api/[controller]")]
public class ImageUploadController(IWebHostEnvironment webHostEnvironment) : ControllerBase
{

    // Hver tabell får hver sin mappe med bilder
    // Hver mappe får sitt eget endepunkt, så det enkelt kan brukes i service i frontend
    // Basert på endpoint, kalles SaveFile funksjonen med folder forhåndsbestemt i absolutePath.

    [HttpPost("athlete")] // http://localhost:5110/api/ImageUpload/athlete
    public async Task<ActionResult> UploadAthlete(IFormFile file)
    {
        return await SaveFile(file, "AthleteImages");
    }


    [HttpPost("venue")] // http://localhost:5110/api/ImageUpload/venue
    public async Task<ActionResult> UploadVenue(IFormFile file)
    {
        return await SaveFile(file, "VenueImages");
    }
    
    private async Task<ActionResult> SaveFile(IFormFile file, string folder)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            string webRootPath = webHostEnvironment.WebRootPath;
            string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            string absolutePath = Path.Combine(
                webRootPath,
                "images",
                folder,
                uniqueFileName
            );

            using (var fileStream = new FileStream(absolutePath, FileMode.Create))
            {
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