using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class FinanceController (SportsWorldContext _context) : ControllerBase
{
    [HttpGet] // Hent all finans-info, selv om det kun er en rad i tabellen.
    public async Task<ActionResult<List<Finance>>> Get()
    {
        try
        {
            List<Finance> finances = await _context.Finances.ToListAsync();
            return Ok(finances);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"En feil oppsto: {e.Message}");
        }
    }


    [HttpPost] // Skal kun brukes om raden har blitt slettet og bruker vil legge inn all data på nytt. Flush and reset.
    public async Task<ActionResult<Finance>> Post(Finance newFinance)
    {
        try
        {
            var existingFinance = await _context.Finances.FirstOrDefaultAsync();

             if (existingFinance != null)
        {
            return BadRequest("Finans-objekt finnes allerede. Oppdater dette eller slett det for å skape nytt.");
        }

            _context.Finances.Add(newFinance);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = newFinance.Id }, newFinance);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpDelete] // Sletter første rad i tabellen. Skal aldri være flere rader her uansett.
    public async Task<IActionResult> Delete()
    {
        try
        {
            var finance = await _context.Finances.FirstOrDefaultAsync();

            if (finance != null)
            {
                _context.Finances.Remove(finance);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return NotFound("Fant ikke finans-objekt");
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpPut] // Endre info i finance-raden
    public async Task<ActionResult<Finance>> Put(Finance editedFinance)
    {
        try
        {
            var finance = await _context.Finances.FirstOrDefaultAsync();
        
            /* Sjekker først om det finnes noe å redigere. */
            if (finance == null)
            {
                return NotFound("Ingen finans-objekter å oppdatere. Legg til");
            }

            _context.Entry(editedFinance).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }
}
