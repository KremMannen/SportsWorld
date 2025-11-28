using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class FinanceController (SportsWorldContext _context) : ControllerBase
{
    [HttpGet]
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

    [HttpGet("{id}")]
    public async Task<ActionResult<Finance>> Get(int id)
    {
        try
        {
            Finance? finance = await _context.Finances.FindAsync(id);
            if (finance == null)
            {
                return NotFound("No finance found with that ID.");
            }
            return Ok(finance);
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
            _context.Finances.Add(newFinance);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = newFinance.Id }, newFinance);
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
            Finance? finance = await _context.Finances.FindAsync(id);
            if (finance != null)
            {
                _context.Finances.Remove(finance);
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
    public async Task<ActionResult<Finance>> Put(Finance editedFinance)
    {
        try
        {
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
