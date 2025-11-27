using System.ComponentModel.DataAnnotations;
using sportsworld_backend.Interfaces;

namespace sportsworld_backend.Models;

public class Finance : IFinance
{
    [Key]
    public int Id { get; set; }
    public int MoneyLeft { get; set; }
    public int NumberOfPurchases { get; set; }
    public int MoneySpent { get; set; }
}