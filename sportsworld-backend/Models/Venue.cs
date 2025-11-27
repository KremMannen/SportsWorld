using System.ComponentModel.DataAnnotations;

using sportsworld_backend.Interfaces;

public class Venue : IVenue
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Image { get; set; } = string.Empty;
}