namespace sportsworld_backend.Interfaces;

interface IAthlete
{
    int Id { get; set; }
    string Name { get; set; }
    string Gender { get; set; }
    int Price { get; set; }
    string Image { get; set; }
    bool PurchaseStatus { get; set;}
}