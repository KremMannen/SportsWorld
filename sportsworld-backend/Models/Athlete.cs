using System.ComponentModel.DataAnnotations;
using sportsworld_backend.Interfaces;

namespace sportsworld_backend.Models;

public class Athlete : IAthlete
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Image { get; set; } = string.Empty;
    public bool Purchased { get; set;}
}