namespace backend.DTOs;

public class TravelPreferenceDto
{
    public string? Gender { get; set; }
    public string? AgeRange { get; set; }
    public string? BudgetCategory { get; set; }
    public string? PreferredContinent { get; set; }
    public int? TravelDurationDays { get; set; }
    public string? AccommodationType { get; set; }
    public string? TransportationPreference { get; set; }
}