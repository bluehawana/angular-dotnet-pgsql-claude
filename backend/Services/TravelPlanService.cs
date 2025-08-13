using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Services;

public class TravelPlanService : ITravelPlanService
{
    private readonly TravelPlannerContext _context;
    private readonly IDestinationService _destinationService;

    public TravelPlanService(TravelPlannerContext context, IDestinationService destinationService)
    {
        _context = context;
        _destinationService = destinationService;
    }

    public async Task<TravelPlanDto> GenerateAITravelPlanAsync(GeneratePlanRequest request)
    {
        var destination = await _destinationService.GetDestinationByIdAsync(request.DestinationId);
        if (destination == null)
        {
            throw new ArgumentException("Destination not found");
        }

        // Generate AI travel plan based on preferences
        var aiPlan = GenerateAIPlan(request.Preferences, destination);
        
        return new TravelPlanDto
        {
            Title = $"{destination.Name} Adventure - {request.Preferences.BudgetCategory} Budget",
            TotalBudget = aiPlan.TotalBudget,
            Destination = destination,
            RecommendedAccommodation = aiPlan.RecommendedAccommodation,
            RecommendedTransport = aiPlan.RecommendedTransport,
            DailyItinerary = aiPlan.DailyItinerary,
            BudgetBreakdown = aiPlan.BudgetBreakdown,
            TravelTips = aiPlan.TravelTips,
            PreparationChecklist = aiPlan.PreparationChecklist,
            PlacesToVisit = aiPlan.PlacesToVisit,
            MoneySavingTips = aiPlan.MoneySavingTips,
            Status = "draft"
        };
    }

    public async Task<TravelPlanDto?> GetTravelPlanByIdAsync(int id)
    {
        var travelPlan = await _context.TravelPlans
            .Include(tp => tp.Destination)
            .ThenInclude(d => d!.Continent)
            .Include(tp => tp.Activities)
            .FirstOrDefaultAsync(tp => tp.Id == id);

        if (travelPlan == null)
            return null;

        return MapToDto(travelPlan);
    }

    public async Task<IEnumerable<TravelPlanDto>> GetUserTravelPlansAsync(int userId)
    {
        var travelPlans = await _context.TravelPlans
            .Include(tp => tp.Destination)
            .ThenInclude(d => d!.Continent)
            .Where(tp => tp.UserId == userId)
            .OrderByDescending(tp => tp.CreatedAt)
            .ToListAsync();

        return travelPlans.Select(MapToDto);
    }

    public async Task<TravelPlanDto> SaveTravelPlanAsync(SaveTravelPlanRequest request)
    {
        var travelPlan = new TravelPlan
        {
            UserId = request.UserId,
            Title = request.Title,
            TotalBudget = request.TravelPlan.TotalBudget,
            StartDate = request.TravelPlan.StartDate,
            EndDate = request.TravelPlan.EndDate,
            Status = request.TravelPlan.Status,
            DestinationId = request.TravelPlan.Destination?.Id,
            AiGeneratedPlan = JsonDocument.Parse(JsonSerializer.Serialize(request.TravelPlan))
        };

        _context.TravelPlans.Add(travelPlan);
        await _context.SaveChangesAsync();

        return await GetTravelPlanByIdAsync(travelPlan.Id) ?? new TravelPlanDto();
    }

    public async Task<TravelPlanDto?> UpdateTravelPlanAsync(int id, UpdateTravelPlanRequest request)
    {
        var travelPlan = await _context.TravelPlans.FindAsync(id);
        if (travelPlan == null)
            return null;

        if (!string.IsNullOrEmpty(request.Title))
            travelPlan.Title = request.Title;
        
        if (!string.IsNullOrEmpty(request.Status))
            travelPlan.Status = request.Status;
        
        if (request.StartDate.HasValue)
            travelPlan.StartDate = request.StartDate;
        
        if (request.EndDate.HasValue)
            travelPlan.EndDate = request.EndDate;

        travelPlan.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return await GetTravelPlanByIdAsync(id);
    }

    public async Task<bool> DeleteTravelPlanAsync(int id)
    {
        var travelPlan = await _context.TravelPlans.FindAsync(id);
        if (travelPlan == null)
            return false;

        _context.TravelPlans.Remove(travelPlan);
        await _context.SaveChangesAsync();
        return true;
    }

    private TravelPlanDto MapToDto(TravelPlan travelPlan)
    {
        var dto = new TravelPlanDto
        {
            Id = travelPlan.Id,
            Title = travelPlan.Title,
            TotalBudget = travelPlan.TotalBudget,
            StartDate = travelPlan.StartDate,
            EndDate = travelPlan.EndDate,
            Status = travelPlan.Status
        };

        if (travelPlan.Destination != null)
        {
            dto.Destination = new DestinationDto
            {
                Id = travelPlan.Destination.Id,
                Name = travelPlan.Destination.Name,
                Country = travelPlan.Destination.Country,
                ContinentName = travelPlan.Destination.Continent?.Name ?? "",
                Description = travelPlan.Destination.Description,
                PopularityScore = travelPlan.Destination.PopularityScore,
                ImageUrl = travelPlan.Destination.ImageUrl
            };
        }

        return dto;
    }

    private AIGeneratedPlan GenerateAIPlan(TravelPreferenceDto preferences, DestinationDto destination)
    {
        var budgetCategory = preferences.BudgetCategory?.ToLower() ?? "comfortable";
        var duration = preferences.TravelDurationDays ?? 7;
        var gender = preferences.Gender?.ToLower() ?? "person";
        var ageRange = preferences.AgeRange ?? "30-39";
        
        var budgetMultiplier = budgetCategory switch
        {
            "student" => 0.5m,
            "economic" => 1.0m,
            "comfortable" => 2.0m,
            "business" => 3.5m,
            "luxury" => 6.0m,
            _ => 2.0m
        };

        var baseDailyBudget = 80m * budgetMultiplier;
        var totalBudget = baseDailyBudget * duration;

        var budgetRecommendations = GenerateBudgetRecommendations(budgetCategory, destination, duration, gender, ageRange);
        
        var dailyItinerary = new List<DailyItineraryDto>();
        for (int day = 1; day <= Math.Min(duration, 14); day++)
        {
            var activities = GenerateActivitiesForDay(day, destination, baseDailyBudget, budgetCategory);
            dailyItinerary.Add(new DailyItineraryDto
            {
                DayNumber = day,
                EstimatedCost = activities.Sum(a => a.Cost),
                Activities = activities
            });
        }

        return new AIGeneratedPlan
        {
            TotalBudget = totalBudget,
            RecommendedAccommodation = budgetRecommendations.Accommodation,
            RecommendedTransport = budgetRecommendations.Transportation,
            DailyItinerary = dailyItinerary,
            BudgetBreakdown = CalculateBudgetBreakdown(totalBudget, budgetCategory),
            TravelTips = budgetRecommendations.TravelTips,
            PreparationChecklist = GeneratePreparationChecklist(destination, duration, budgetCategory),
            PlacesToVisit = dailyItinerary.SelectMany(d => d.Activities).Count(a => a.Cost > 0),
            MoneySavingTips = budgetRecommendations.MoneySavingTips
        };
    }

    private List<ActivityDto> GenerateActivitiesForDay(int day, DestinationDto destination, decimal dailyBudget, string budgetCategory)
    {
        var activities = new List<ActivityDto>();
        
        if (day == 1)
        {
            activities.AddRange(GetArrivalDayActivities(destination, dailyBudget, budgetCategory));
        }
        else
        {
            var morningActivities = GetMorningActivities(destination, dailyBudget, budgetCategory);
            var afternoonActivities = GetAfternoonActivities(destination, dailyBudget, budgetCategory);
            var eveningActivities = GetEveningActivities(destination, dailyBudget, budgetCategory);
            
            activities.Add(morningActivities[day % morningActivities.Count]);
            activities.Add(afternoonActivities[day % afternoonActivities.Count]);
            activities.Add(eveningActivities[day % eveningActivities.Count]);
        }

        return activities;
    }

    private List<ActivityDto> GetArrivalDayActivities(DestinationDto destination, decimal dailyBudget, string budgetCategory)
    {
        return budgetCategory switch
        {
            "student" => new List<ActivityDto>
            {
                new() { Time = "09:00", Name = "Budget Accommodation Check-in", Description = $"Check into hostel or budget accommodation in {destination.Name}.", Cost = 0 },
                new() { Time = "14:00", Name = "Free Walking Tour", Description = $"Join a free walking tour to get oriented in {destination.Name}.", Cost = 0 },
                new() { Time = "19:00", Name = "Street Food Dinner", Description = $"Try affordable local street food in {destination.Name}.", Cost = dailyBudget * 0.2m }
            },
            _ => new List<ActivityDto>
            {
                new() { Time = "09:00", Name = "Arrival & Hotel Check-in", Description = $"Arrive in {destination.Name} and check into your accommodation.", Cost = 0 },
                new() { Time = "14:00", Name = "City Orientation Walk", Description = $"Get familiar with {destination.Name}'s main areas and landmarks.", Cost = dailyBudget * 0.1m },
                new() { Time = "19:00", Name = "Welcome Dinner", Description = $"Try authentic {destination.Country} cuisine at a local restaurant.", Cost = dailyBudget * 0.3m }
            }
        };
    }

    private List<ActivityDto> GetMorningActivities(DestinationDto destination, decimal dailyBudget, string budgetCategory)
    {
        return budgetCategory switch
        {
            "student" => new List<ActivityDto>
            {
                new() { Time = "08:00", Name = "Convenience Store Breakfast", Description = $"Grab affordable breakfast from a convenience store.", Cost = dailyBudget * 0.08m },
                new() { Time = "09:00", Name = "Free Museum Day", Description = $"Visit museums on free admission days in {destination.Name}.", Cost = 0 },
                new() { Time = "09:30", Name = "Public Park Visit", Description = $"Explore free public parks and gardens in {destination.Name}.", Cost = 0 }
            },
            _ => new List<ActivityDto>
            {
                new() { Time = "08:00", Name = "Traditional Breakfast", Description = $"Experience a traditional {destination.Country} breakfast.", Cost = dailyBudget * 0.15m },
                new() { Time = "09:00", Name = "Museum Visit", Description = $"Explore the cultural heritage of {destination.Name}.", Cost = dailyBudget * 0.2m },
                new() { Time = "09:30", Name = "Historical Site Tour", Description = $"Discover the rich history of {destination.Name}.", Cost = dailyBudget * 0.25m }
            }
        };
    }

    private List<ActivityDto> GetAfternoonActivities(DestinationDto destination, decimal dailyBudget, string budgetCategory)
    {
        return budgetCategory switch
        {
            "student" => new List<ActivityDto>
            {
                new() { Time = "13:00", Name = "Local Market Lunch", Description = $"Eat cheaply at local markets in {destination.Name}.", Cost = dailyBudget * 0.15m },
                new() { Time = "14:00", Name = "Free Cultural Sites", Description = $"Visit free cultural sites and temples in {destination.Name}.", Cost = 0 },
                new() { Time = "15:00", Name = "City Hiking Trail", Description = $"Explore free hiking trails near {destination.Name}.", Cost = 0 }
            },
            _ => new List<ActivityDto>
            {
                new() { Time = "13:00", Name = "Local Market Visit", Description = $"Browse local markets and try street food in {destination.Name}.", Cost = dailyBudget * 0.2m },
                new() { Time = "14:00", Name = "Cultural Experience", Description = $"Participate in a cultural activity unique to {destination.Name}.", Cost = dailyBudget * 0.3m },
                new() { Time = "15:00", Name = "Scenic Viewpoint", Description = $"Visit the best viewpoint in {destination.Name}.", Cost = dailyBudget * 0.1m }
            }
        };
    }

    private List<ActivityDto> GetEveningActivities(DestinationDto destination, decimal dailyBudget, string budgetCategory)
    {
        return budgetCategory switch
        {
            "student" => new List<ActivityDto>
            {
                new() { Time = "18:00", Name = "Free Sunset Viewing", Description = $"Watch sunset from free public viewpoints in {destination.Name}.", Cost = 0 },
                new() { Time = "19:00", Name = "Budget Restaurant", Description = $"Dine at budget-friendly local restaurants in {destination.Name}.", Cost = dailyBudget * 0.25m },
                new() { Time = "20:00", Name = "Free Night Markets", Description = $"Browse free night markets and street entertainment in {destination.Name}.", Cost = 0 }
            },
            _ => new List<ActivityDto>
            {
                new() { Time = "18:00", Name = "Sunset Experience", Description = $"Watch the sunset from {destination.Name}'s most beautiful spot.", Cost = dailyBudget * 0.15m },
                new() { Time = "19:00", Name = "Fine Dining", Description = $"Enjoy dinner at a highly-rated restaurant in {destination.Name}.", Cost = dailyBudget * 0.35m },
                new() { Time = "20:00", Name = "Night Entertainment", Description = $"Experience {destination.Name}'s nightlife and entertainment.", Cost = dailyBudget * 0.25m }
            }
        };
    }

    private BudgetRecommendations GenerateBudgetRecommendations(string budgetCategory, DestinationDto destination, int duration, string gender, string ageRange)
    {
        return budgetCategory switch
        {
            "student" => new BudgetRecommendations
            {
                Accommodation = GetStudentAccommodationRecommendation(destination),
                Transportation = GetStudentTransportationRecommendation(destination),
                TravelTips = GetStudentTravelTips(destination, duration),
                MoneySavingTips = GetStudentMoneySavingTips(destination)
            },
            "economic" => new BudgetRecommendations
            {
                Accommodation = "Budget hotels or guesthouses",
                Transportation = "Public transport and economy flights",
                TravelTips = GetEconomicTravelTips(destination),
                MoneySavingTips = GetEconomicMoneySavingTips(destination)
            },
            _ => new BudgetRecommendations
            {
                Accommodation = "Mid-range hotels",
                Transportation = "Mix of public and private transport",
                TravelTips = GetGeneralTravelTips(destination),
                MoneySavingTips = GetGeneralMoneySavingTips(destination)
            }
        };
    }

    private string GetStudentAccommodationRecommendation(DestinationDto destination)
    {
        return destination.Name?.ToLower() switch
        {
            "japan" => "Hostels, capsule hotels, or Airbnb shared rooms. Consider staying in Shibuya or Shinjuku hostels for easy access to public transport.",
            "china" => "Youth hostels or budget hotels in city centers. Look for accommodations near metro stations.",
            _ => "Hostels, budget guesthouses, or shared Airbnb accommodations near public transportation."
        };
    }

    private string GetStudentTransportationRecommendation(DestinationDto destination)
    {
        return destination.Name?.ToLower() switch
        {
            "japan" => "Book night flights for cheaper fares. Get a JR Pass for unlimited train travel. Use local metro and buses instead of taxis.",
            "china" => "Look for budget airlines or night flights. Use high-speed trains between cities and metro within cities.",
            _ => "Book flights well in advance, consider night flights. Use public transportation, walk when possible."
        };
    }

    private List<string> GetStudentTravelTips(DestinationDto destination, int duration)
    {
        var baseTips = new List<string>
        {
            "Book accommodations in advance for better rates",
            "Travel during shoulder season for lower prices",
            "Use student discounts wherever available",
            "Pack light to avoid baggage fees"
        };

        if (destination.Name?.ToLower() == "japan")
        {
            baseTips.AddRange(new[]
            {
                "Visit convenience stores for affordable meals",
                "Use 100-yen shops for daily necessities",
                "Take advantage of free Wi-Fi at stations and convenience stores"
            });
        }

        return baseTips;
    }

    private List<string> GetStudentMoneySavingTips(DestinationDto destination)
    {
        var baseTips = new List<string>
        {
            "Cook your own meals when possible",
            "Look for group discounts and deals",
            "Use apps like Groupon for activity discounts",
            "Visit free attractions and museums on free days"
        };

        if (destination.Name?.ToLower() == "japan")
        {
            baseTips.AddRange(new[]
            {
                "Look for 'all-you-can-eat' restaurants for good value",
                "Use discount apps like Gurunavi for restaurant coupons",
                "Shop at Don Quijote for affordable souvenirs"
            });
        }

        return baseTips;
    }

    private List<string> GetEconomicTravelTips(DestinationDto destination)
    {
        return new List<string>
        {
            "Compare prices across multiple booking platforms",
            "Consider package deals for accommodation + transport",
            "Use local recommendation apps for authentic experiences",
            "Balance splurge experiences with budget-friendly activities"
        };
    }

    private List<string> GetEconomicMoneySavingTips(DestinationDto destination)
    {
        return new List<string>
        {
            "Look for lunch specials at restaurants",
            "Use city tourist passes for multiple attractions",
            "Shop at local supermarkets for snacks and drinks",
            "Take advantage of happy hour deals"
        };
    }

    private List<string> GetGeneralTravelTips(DestinationDto destination)
    {
        return new List<string>
        {
            "Research local customs and etiquette",
            "Download offline maps and translation apps",
            "Keep copies of important documents",
            "Inform your bank about travel dates"
        };
    }

    private List<string> GetGeneralMoneySavingTips(DestinationDto destination)
    {
        return new List<string>
        {
            "Use credit cards with no foreign transaction fees",
            "Compare currency exchange rates",
            "Keep track of expenses with a budget app",
            "Set daily spending limits"
        };
    }

    private Dictionary<string, decimal> CalculateBudgetBreakdown(decimal totalBudget, string budgetCategory)
    {
        return budgetCategory switch
        {
            "student" => new Dictionary<string, decimal>
            {
                ["accommodation"] = totalBudget * 0.35m,
                ["transportation"] = totalBudget * 0.25m,
                ["food"] = totalBudget * 0.25m,
                ["activities"] = totalBudget * 0.10m,
                ["misc"] = totalBudget * 0.05m
            },
            _ => new Dictionary<string, decimal>
            {
                ["accommodation"] = totalBudget * 0.40m,
                ["transportation"] = totalBudget * 0.20m,
                ["food"] = totalBudget * 0.20m,
                ["activities"] = totalBudget * 0.15m,
                ["misc"] = totalBudget * 0.05m
            }
        };
    }

    private List<string> GeneratePreparationChecklist(DestinationDto destination, int duration, string budgetCategory)
    {
        var checklist = new List<string>
        {
            "Check passport expiration date",
            "Apply for visa if required",
            "Book flights and accommodation",
            "Get travel insurance",
            "Notify bank of travel plans",
            "Research local emergency contacts"
        };

        if (destination.Name?.ToLower() == "japan")
        {
            checklist.AddRange(new[]
            {
                "Download Google Translate with camera feature",
                "Get a JR Pass if staying more than 7 days",
                "Bring cash as many places don't accept cards"
            });
        }

        if (budgetCategory == "student")
        {
            checklist.AddRange(new[]
            {
                "Get international student ID card",
                "Research student discounts available",
                "Set up international banking if needed"
            });
        }

        return checklist;
    }

    private class BudgetRecommendations
    {
        public string Accommodation { get; set; } = string.Empty;
        public string Transportation { get; set; } = string.Empty;
        public List<string> TravelTips { get; set; } = new();
        public List<string> MoneySavingTips { get; set; } = new();
    }

    private class AIGeneratedPlan
    {
        public decimal TotalBudget { get; set; }
        public string RecommendedAccommodation { get; set; } = string.Empty;
        public string RecommendedTransport { get; set; } = string.Empty;
        public List<DailyItineraryDto> DailyItinerary { get; set; } = new();
        public Dictionary<string, decimal> BudgetBreakdown { get; set; } = new();
        public List<string> TravelTips { get; set; } = new();
        public List<string> PreparationChecklist { get; set; } = new();
        public int PlacesToVisit { get; set; }
        public List<string> MoneySavingTips { get; set; } = new();
    }
}