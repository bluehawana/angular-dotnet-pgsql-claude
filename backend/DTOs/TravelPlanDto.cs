namespace backend.DTOs;

public class TravelPlanDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal? TotalBudget { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = "draft";
    public DestinationDto? Destination { get; set; }
    public string? RecommendedAccommodation { get; set; }
    public string? RecommendedTransport { get; set; }
    public List<DailyItineraryDto> DailyItinerary { get; set; } = new();
    public Dictionary<string, decimal>? BudgetBreakdown { get; set; }
    public List<string>? TravelTips { get; set; }
    public List<string>? PreparationChecklist { get; set; }
    public int PlacesToVisit { get; set; }
    public List<string>? MoneySavingTips { get; set; }
}

public class DailyItineraryDto
{
    public int DayNumber { get; set; }
    public decimal EstimatedCost { get; set; }
    public List<ActivityDto> Activities { get; set; } = new();
}

public class ActivityDto
{
    public string Time { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public string? Location { get; set; }
}

public class GeneratePlanRequest
{
    public TravelPreferenceDto Preferences { get; set; } = new();
    public int DestinationId { get; set; }
    public int UserId { get; set; } = 1; // Default for demo
}

public class SaveTravelPlanRequest
{
    public string Title { get; set; } = string.Empty;
    public int UserId { get; set; } = 1; // Default for demo
    public TravelPlanDto TravelPlan { get; set; } = new();
}

public class UpdateTravelPlanRequest
{
    public string? Title { get; set; }
    public string? Status { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}

public class DetailedPlanRequest
{
    public string SelectedDestination { get; set; } = string.Empty;
    public string[] SelectedCities { get; set; } = Array.Empty<string>();
    public int TravelDurationDays { get; set; }
    public string BudgetCategory { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string AgeRange { get; set; } = string.Empty;
}