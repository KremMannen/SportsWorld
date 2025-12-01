using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AthleteController (SportsWorldContext _context) : ControllerBase
{
    [HttpGet] // Hent alle atleter
    public async Task<ActionResult<List<Athlete>>> Get()
    {
        try
        {
            List<Athlete> athletes = await _context.Athletes.ToListAsync();
            return Ok(athletes);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpGet("{id}")] // Hent atlet basert på ID
    public async Task<ActionResult<Athlete>> Get(int id)
    {
        try
        {
            Athlete? athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound("No athlete found with that ID.");
            }
            return Ok(athlete); 
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpGet("byname/{name}")]
    public async Task<ActionResult<List<Athlete>>> GetByName(string name)
    {
         try
        {
            List<Athlete> athletes = await _context.Athletes.Where(
                athlete => athlete.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            // ToListAsync returnerer en tom liste dersom det ikke er noen resultater. Ikke null. Sjekker derfor antall returnerte objekter.
            if (athletes.Count == 0)
            {
                return NotFound("No athlete found with that Name.");
            }

            return Ok(athletes); 
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpPost] // Legg til ny atlet
    public async Task<ActionResult<Athlete>> Post(Athlete newAthlete)
    {
        try
        {
            _context.Athletes.Add(newAthlete);
            await _context.SaveChangesAsync(); 
            return CreatedAtAction("Get", new {id = newAthlete.Id}, newAthlete); 
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpDelete("{id}")] // Slett atlet basert på ID
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            Athlete? athlete = await _context.Athletes.FindAsync(id);
            if (athlete != null)
            {
                _context.Athletes.Remove(athlete);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpPut] // Endre atlet-info
    public async Task<ActionResult<Athlete>> Put(Athlete editedAthlete)
    {
        try
        {
            _context.Entry(editedAthlete).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }
}