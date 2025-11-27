using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class FinanceController (SportsWorldContext _SportsWorldContext) : ControllerBase
{
    [HttpGet]
        public async Task<ActionResult<List<Finance>>> Get()
    {
        try
        {
            List<Finance> finances = await _SportsWorldContext.Finances.ToListAsync();
            return Ok(finances);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"En feil oppsto: {e.Message}");
        }
    }
}
