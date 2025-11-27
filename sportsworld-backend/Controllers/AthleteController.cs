using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;
using sportsworld_backend.Models;

namespace sportsworld_backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AthleteController (SportsWorldContext _SportsWorldContext) : ControllerBase
{
    [HttpGet]
        public async Task<ActionResult<List<Athlete>>> Get()
    {
        try
        {
            List<Athlete> athletes = await _SportsWorldContext.Athletes.ToListAsync();
            return Ok(athletes);
        }
        catch (Exception e)
        {
            return StatusCode(500, $"En feil oppsto: {e.Message}");
        }
    }
}