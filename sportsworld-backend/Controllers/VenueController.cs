using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class VenueController (SportsWorldContext _context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Venue>>> Get()
    {
        try
        {
            List<Venue> venues = await _context.Venues.ToListAsync();
            return Ok(venues);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"En feil oppsto: {e.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Venue>> Get(int id)
    {
        try
        {
            Venue? venue = await _context.Venues.FindAsync(id);
            if (venue == null)
            {
                return NotFound("No venue found with that ID.");
            }
            return Ok(venue);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Venue>> Post(Venue newVenue)
    {
        try
        {
            _context.Venues.Add(newVenue);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = newVenue.Id }, newVenue);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            Venue? venue = await _context.Venues.FindAsync(id);
            if (venue != null)
            {
                _context.Venues.Remove(venue);
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

    [HttpPut]
    public async Task<ActionResult<Venue>> Put(Venue editedVenue)
    {
        try
        {
            _context.Entry(editedVenue).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }
}
