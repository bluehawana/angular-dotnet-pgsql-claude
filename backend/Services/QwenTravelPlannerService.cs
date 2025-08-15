using System.Text.Json;
using OpenAI;

namespace backend.Services;

public class QwenTravelPlannerService
{
    private readonly OpenAIClient _openAIClient;
    private readonly ILogger<QwenTravelPlannerService> _logger;

    public QwenTravelPlannerService(ILogger<QwenTravelPlannerService> logger)
    {
        _logger = logger;
        
        // Configure for Qwen API via OpenAI-compatible endpoint
        var qwenApiKey = Environment.GetEnvironmentVariable("QWEN_API_KEY") ?? "your-qwen-api-key";
        var qwenBaseUrl = Environment.GetEnvironmentVariable("QWEN_BASE_URL") ?? "https://dashscope.aliyuncs.com/compatible-mode/v1";
        
        _openAIClient = new OpenAIClient(new System.ClientModel.ApiKeyCredential(qwenApiKey), new OpenAIClientOptions
        {
            Endpoint = new Uri(qwenBaseUrl)
        });
    }

    public async Task<DetailedTravelPlan> GenerateDetailedPlanAsync(TravelPlanRequest request)
    {
        try
        {
            var prompt = BuildDetailedPlanPrompt(request);
            
            var chatMessages = new List<OpenAI.Chat.ChatMessage>
            {
                new OpenAI.Chat.SystemChatMessage("You are an expert travel planner specializing in creating detailed, actionable travel itineraries with specific recommendations for flights, hotels, transportation, tours, and dining. Always provide realistic pricing, specific business names, and practical booking information."),
                new OpenAI.Chat.UserChatMessage(prompt)
            };

            var response = await _openAIClient.GetChatClient("qwen-turbo").CompleteChatAsync(chatMessages, new OpenAI.Chat.ChatCompletionOptions
            {
                MaxOutputTokenCount = 4000,
                Temperature = 0.7f
            });

            var planJson = response.Value.Content.FirstOrDefault()?.Text;
            
            if (string.IsNullOrEmpty(planJson))
            {
                throw new InvalidOperationException("Empty response from Qwen API");
            }

            var plan = JsonSerializer.Deserialize<DetailedTravelPlan>(planJson);
            return plan ?? throw new InvalidOperationException("Failed to deserialize travel plan");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating detailed travel plan with Qwen API");
            
            // Fallback to basic plan if API fails
            return GenerateFallbackPlan(request);
        }
    }

    private string BuildDetailedPlanPrompt(TravelPlanRequest request)
    {
        var cities = request.SelectedCities?.Any() == true ? 
            string.Join(", ", request.SelectedCities) : 
            request.SelectedDestination;

        return $@"
Create a detailed, ACTIONABLE travel plan in JSON format. This must be a realistic implementation guide, not generic advice.

**Travel Details:**
- Destination: {request.SelectedDestination}
- Cities to visit: {cities}
- Duration: {request.TravelDurationDays} days
- Budget: {request.BudgetCategory}
- Traveler: {request.Gender}, {request.AgeRange}

**CRITICAL REQUIREMENTS - Must be SPECIFIC and ACTIONABLE:**
1. **Flights**: Real airline names, actual flight routes, current price ranges (USD), specific booking websites, optimal booking times
2. **Hotels**: ACTUAL hotel names with real addresses, current nightly rates, booking.com/expedia/hotels.com links, check-in/out procedures
3. **Transportation**: Specific transport companies, exact ticket prices, where to buy tickets, mobile apps to download, station names
4. **Daily Schedule**: Hour-by-hour itinerary with REAL business names, exact addresses, opening hours, ticket prices, advance booking requirements
5. **Restaurants**: ACTUAL restaurant names, specific addresses, phone numbers, price ranges, must-try dishes, reservation requirements
6. **Tours**: Real tour company names, specific tour packages, exact prices, booking URLs, meeting points, what's included
7. **Traffic/Navigation**: Best routes between locations, estimated travel times, traffic patterns, Google Maps links, local navigation apps
8. **Practical Actions**: Step-by-step visa application process, currency exchange locations, specific safety precautions, emergency contacts

**JSON Structure:**
{{
  ""summary"": {{
    ""totalBudget"": number,
    ""dailyAverage"": number,
    ""highlights"": [""string""]
  }},
  ""flights"": {{
    ""outbound"": {{
      ""airlines"": [""string""],
      ""route"": ""string"",
      ""avgPrice"": number,
      ""bookingTips"": [""string""]
    }},
    ""internal"": [{{
      ""route"": ""string"",
      ""options"": [""string""],
      ""avgPrice"": number
    }}]
  }},
  ""accommodations"": [{{
    ""city"": ""string"",
    ""hotels"": [{{
      ""name"": ""string"",
      ""address"": ""string"",
      ""priceRange"": ""string"",
      ""bookingPlatforms"": [""string""],
      ""features"": [""string""]
    }}]
  }}],
  ""dailyItinerary"": [{{
    ""day"": number,
    ""city"": ""string"",
    ""activities"": [{{
      ""time"": ""string"",
      ""activity"": ""string"",
      ""location"": ""string"",
      ""address"": ""string"",
      ""cost"": number,
      ""openingHours"": ""string"",
      ""bookingInfo"": ""string"",
      ""bookingUrl"": ""string"",
      ""phoneNumber"": ""string"",
      ""estimatedDuration"": ""string""
    }}],
    ""meals"": [{{
      ""time"": ""string"",
      ""restaurant"": ""string"",
      ""cuisine"": ""string"",
      ""address"": ""string"",
      ""phoneNumber"": ""string"",
      ""priceRange"": ""string"",
      ""mustTryDishes"": [""string""],
      ""reservationRequired"": boolean,
      ""bookingUrl"": ""string""
    }}],
    ""transportation"": {{
      ""method"": ""string"",
      ""cost"": number,
      ""details"": ""string"",
      ""ticketingInfo"": ""string"",
      ""mobileApp"": ""string""
    }},
    ""navigation"": [{{
      ""from"": ""string"",
      ""to"": ""string"",
      ""route"": ""string"",
      ""estimatedTime"": ""string"",
      ""trafficNotes"": ""string"",
      ""mapsLink"": ""string""
    }}]
  }}],
  ""tours"": [{{
    ""name"": ""string"",
    ""company"": ""string"",
    ""duration"": ""string"",
    ""price"": number,
    ""bookingUrl"": ""string"",
    ""includes"": [""string""]
  }}],
  ""practicalInfo"": {{
    ""visa"": ""string"",
    ""currency"": ""string"",
    ""tipping"": ""string"",
    ""safetyTips"": [""string""],
    ""emergencyNumbers"": {{
      ""police"": ""string"",
      ""medical"": ""string"",
      ""embassy"": ""string""
    }}
  }},
  ""budgetBreakdown"": {{
    ""flights"": number,
    ""accommodation"": number,
    ""transportation"": number,
    ""food"": number,
    ""activities"": number,
    ""tours"": number,
    ""misc"": number
  }}
}}

Make this as specific and actionable as possible with real business names, actual prices in USD, and practical booking information.";
    }

    private DetailedTravelPlan GenerateFallbackPlan(TravelPlanRequest request)
    {
        return new DetailedTravelPlan
        {
            Summary = new PlanSummary
            {
                TotalBudget = 2000,
                DailyAverage = 2000 / request.TravelDurationDays,
                Highlights = new[] { "Custom travel plan", "Local experiences", "Cultural immersion" }
            },
            Flights = new FlightInfo
            {
                Outbound = new FlightOption
                {
                    Airlines = new[] { "Major airlines available" },
                    Route = $"Your location → {request.SelectedDestination}",
                    AvgPrice = 800,
                    BookingTips = new[] { "Book 2-3 months in advance", "Use comparison sites", "Consider connecting flights" }
                },
                Internal = new FlightOption[0]
            },
            DailyItinerary = GenerateFallbackItinerary(request),
            PracticalInfo = new PracticalInfo
            {
                Visa = "Check visa requirements for your nationality",
                Currency = "Local currency",
                Tipping = "Check local tipping customs",
                SafetyTips = new[] { "Keep copies of documents", "Stay aware of surroundings", "Use official transport" }
            }
        };
    }

    private DayItinerary[] GenerateFallbackItinerary(TravelPlanRequest request)
    {
        var itinerary = new List<DayItinerary>();
        
        for (int i = 1; i <= request.TravelDurationDays; i++)
        {
            itinerary.Add(new DayItinerary
            {
                Day = i,
                City = request.SelectedDestination,
                Activities = new[]
                {
                    new Activity
                    {
                        Time = "09:00",
                        ActivityName = "Morning exploration",
                        Location = "City center",
                        Address = "Main city center area",
                        Cost = 50,
                        OpeningHours = "24/7",
                        BookingInfo = "Walk-in available",
                        BookingUrl = "",
                        PhoneNumber = "",
                        EstimatedDuration = "3 hours"
                    },
                    new Activity
                    {
                        Time = "14:00",
                        ActivityName = "Afternoon cultural visit",
                        Location = "Local attraction",
                        Address = "Cultural district",
                        Cost = 25,
                        OpeningHours = "9:00 AM - 6:00 PM",
                        BookingInfo = "Online booking recommended",
                        BookingUrl = "",
                        PhoneNumber = "",
                        EstimatedDuration = "2 hours"
                    }
                },
                Meals = new[]
                {
                    new MealRecommendation
                    {
                        Time = "12:00",
                        Restaurant = "Local restaurant",
                        Cuisine = "Traditional",
                        Address = "City center",
                        PhoneNumber = "",
                        PriceRange = "$15-25",
                        MustTryDishes = new[] { "Local specialty" },
                        ReservationRequired = false,
                        BookingUrl = ""
                    }
                },
                Transportation = new TransportationDay
                {
                    Method = "Public transport",
                    Cost = 10,
                    Details = "Day pass recommended",
                    TicketingInfo = "Available at stations",
                    MobileApp = "Local transit app"
                },
                Navigation = new[]
                {
                    new NavigationInfo
                    {
                        From = "Hotel",
                        To = "City center",
                        Route = "Main street",
                        EstimatedTime = "15 minutes",
                        TrafficNotes = "Light morning traffic",
                        MapsLink = ""
                    }
                }
            });
        }
        
        return itinerary.ToArray();
    }
}

public class TravelPlanRequest
{
    public string SelectedDestination { get; set; } = "";
    public string[] SelectedCities { get; set; } = Array.Empty<string>();
    public int TravelDurationDays { get; set; }
    public string BudgetCategory { get; set; } = "";
    public string Gender { get; set; } = "";
    public string AgeRange { get; set; } = "";
}

public class DetailedTravelPlan
{
    public PlanSummary Summary { get; set; } = new();
    public FlightInfo Flights { get; set; } = new();
    public AccommodationInfo[] Accommodations { get; set; } = Array.Empty<AccommodationInfo>();
    public DayItinerary[] DailyItinerary { get; set; } = Array.Empty<DayItinerary>();
    public TourInfo[] Tours { get; set; } = Array.Empty<TourInfo>();
    public PracticalInfo PracticalInfo { get; set; } = new();
    public BudgetBreakdown BudgetBreakdown { get; set; } = new();
}

public class PlanSummary
{
    public decimal TotalBudget { get; set; }
    public decimal DailyAverage { get; set; }
    public string[] Highlights { get; set; } = Array.Empty<string>();
}

public class FlightInfo
{
    public FlightOption Outbound { get; set; } = new();
    public FlightOption[] Internal { get; set; } = Array.Empty<FlightOption>();
}

public class FlightOption
{
    public string[] Airlines { get; set; } = Array.Empty<string>();
    public string Route { get; set; } = "";
    public decimal AvgPrice { get; set; }
    public string[] BookingTips { get; set; } = Array.Empty<string>();
}

public class AccommodationInfo
{
    public string City { get; set; } = "";
    public HotelRecommendation[] Hotels { get; set; } = Array.Empty<HotelRecommendation>();
}

public class HotelRecommendation
{
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string PriceRange { get; set; } = "";
    public string[] BookingPlatforms { get; set; } = Array.Empty<string>();
    public string[] Features { get; set; } = Array.Empty<string>();
}

public class DayItinerary
{
    public int Day { get; set; }
    public string City { get; set; } = "";
    public Activity[] Activities { get; set; } = Array.Empty<Activity>();
    public MealRecommendation[] Meals { get; set; } = Array.Empty<MealRecommendation>();
    public TransportationDay Transportation { get; set; } = new();
    public NavigationInfo[] Navigation { get; set; } = Array.Empty<NavigationInfo>();
}

public class Activity
{
    public string Time { get; set; } = "";
    public string ActivityName { get; set; } = "";
    public string Location { get; set; } = "";
    public string Address { get; set; } = "";
    public decimal Cost { get; set; }
    public string OpeningHours { get; set; } = "";
    public string BookingInfo { get; set; } = "";
    public string BookingUrl { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string EstimatedDuration { get; set; } = "";
}

public class MealRecommendation
{
    public string Time { get; set; } = "";
    public string Restaurant { get; set; } = "";
    public string Cuisine { get; set; } = "";
    public string Address { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string PriceRange { get; set; } = "";
    public string[] MustTryDishes { get; set; } = Array.Empty<string>();
    public bool ReservationRequired { get; set; }
    public string BookingUrl { get; set; } = "";
}

public class TransportationDay
{
    public string Method { get; set; } = "";
    public decimal Cost { get; set; }
    public string Details { get; set; } = "";
    public string TicketingInfo { get; set; } = "";
    public string MobileApp { get; set; } = "";
}

public class TourInfo
{
    public string Name { get; set; } = "";
    public string Company { get; set; } = "";
    public string Duration { get; set; } = "";
    public decimal Price { get; set; }
    public string BookingUrl { get; set; } = "";
    public string[] Includes { get; set; } = Array.Empty<string>();
}

public class PracticalInfo
{
    public string Visa { get; set; } = "";
    public string Currency { get; set; } = "";
    public string Tipping { get; set; } = "";
    public string[] SafetyTips { get; set; } = Array.Empty<string>();
    public EmergencyNumbers EmergencyNumbers { get; set; } = new();
}

public class EmergencyNumbers
{
    public string Police { get; set; } = "";
    public string Medical { get; set; } = "";
    public string Embassy { get; set; } = "";
}

public class BudgetBreakdown
{
    public decimal Flights { get; set; }
    public decimal Accommodation { get; set; }
    public decimal Transportation { get; set; }
    public decimal Food { get; set; }
    public decimal Activities { get; set; }
    public decimal Tours { get; set; }
    public decimal Misc { get; set; }
}

public class NavigationInfo
{
    public string From { get; set; } = "";
    public string To { get; set; } = "";
    public string Route { get; set; } = "";
    public string EstimatedTime { get; set; } = "";
    public string TrafficNotes { get; set; } = "";
    public string MapsLink { get; set; } = "";
}