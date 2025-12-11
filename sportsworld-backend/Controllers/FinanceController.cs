using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class FinanceController (SportsWorldContext _context) : ControllerBase
{
    [HttpGet] // Hent all finans-info, selv om det kun skal være en rad i tabellen.
    public async Task<ActionResult<List<Finance>>> Get()
    {
        try
        {
            List<Finance> finances = await _context.Finances.ToListAsync();
            return Ok(finances);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }


    [HttpPost]
    public async Task<ActionResult<Finance>> Post(Finance newFinance)
    {
        try
        {
            var existingFinance = await _context.Finances.FirstOrDefaultAsync();

             if (existingFinance != null)
        {
            return BadRequest("Can't add new object. Update or delete existing objekt.");
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

    [HttpDelete] // Ubrukt
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
                return NotFound("Can't find Finance-object");
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }

    [HttpPut] 
    public async Task<ActionResult<Finance>> Put(Finance editedFinance)
    {
        try
        {
            _context.Entry(editedFinance).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(editedFinance);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"Error: {e.Message}");
        }
    }
}
