using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;

namespace backend.Services;

public class DestinationService : IDestinationService
{
    private readonly TravelPlannerContext _context;

    public DestinationService(TravelPlannerContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DestinationDto>> GetAllDestinationsAsync()
    {
        return await _context.Destinations
            .Include(d => d.Continent)
            .Select(d => new DestinationDto
            {
                Id = d.Id,
                Name = d.Name,
                Country = d.Country,
                ContinentName = d.Continent.Name,
                Description = d.Description,
                PopularityScore = d.PopularityScore,
                ImageUrl = d.ImageUrl
            })
            .ToListAsync();
    }

    public async Task<DestinationDto?> GetDestinationByIdAsync(int id)
    {
        return await _context.Destinations
            .Include(d => d.Continent)
            .Where(d => d.Id == id)
            .Select(d => new DestinationDto
            {
                Id = d.Id,
                Name = d.Name,
                Country = d.Country,
                ContinentName = d.Continent.Name,
                Description = d.Description,
                PopularityScore = d.PopularityScore,
                ImageUrl = d.ImageUrl
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DestinationDto>> GetDestinationsByContinentAsync(int continentId)
    {
        return await _context.Destinations
            .Include(d => d.Continent)
            .Where(d => d.ContinentId == continentId)
            .OrderByDescending(d => d.PopularityScore)
            .Select(d => new DestinationDto
            {
                Id = d.Id,
                Name = d.Name,
                Country = d.Country,
                ContinentName = d.Continent.Name,
                Description = d.Description,
                PopularityScore = d.PopularityScore,
                ImageUrl = d.ImageUrl
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<DestinationDto>> GetRecommendedDestinationsAsync(TravelPreferenceDto preferences)
    {
        var query = _context.Destinations
            .Include(d => d.Continent)
            .AsQueryable();

        // Filter by preferred continent if specified
        if (!string.IsNullOrEmpty(preferences.PreferredContinent))
        {
            query = query.Where(d => d.Continent.Code.ToLower() == preferences.PreferredContinent.ToLower() ||
                                   d.Continent.Name.ToLower().Contains(preferences.PreferredContinent.ToLower()));
        }

        // Apply budget-based filtering logic
        if (!string.IsNullOrEmpty(preferences.BudgetCategory))
        {
            switch (preferences.BudgetCategory.ToLower())
            {
                case "economy":
                    // Prefer destinations with good value and lower cost
                    query = query.Where(d => d.PopularityScore >= 80);
                    break;
                case "luxury":
                case "ultra-luxury":
                    // Prefer high-end destinations
                    query = query.Where(d => d.PopularityScore >= 85);
                    break;
            }
        }

        // Return top recommendations ordered by popularity
        var recommendations = await query
            .OrderByDescending(d => d.PopularityScore)
            .Take(5)
            .Select(d => new DestinationDto
            {
                Id = d.Id,
                Name = d.Name,
                Country = d.Country,
                ContinentName = d.Continent.Name,
                Description = GeneratePersonalizedDescription(d.Description ?? "", preferences),
                PopularityScore = d.PopularityScore,
                ImageUrl = d.ImageUrl
            })
            .ToListAsync();

        return recommendations;
    }

    private static string GeneratePersonalizedDescription(string originalDescription, TravelPreferenceDto preferences)
    {
        var description = originalDescription;
        
        // Add personalized touches based on preferences
        if (!string.IsNullOrEmpty(preferences.BudgetCategory))
        {
            description += preferences.BudgetCategory.ToLower() switch
            {
                "economy" => " Great value for budget-conscious travelers with plenty of affordable options.",
                "luxury" => " Perfect for luxury travelers seeking premium experiences and accommodations.",
                _ => ""
            };
        }

        if (preferences.TravelDurationDays.HasValue)
        {
            if (preferences.TravelDurationDays <= 3)
                description += " Ideal for a short getaway with must-see highlights.";
            else if (preferences.TravelDurationDays >= 7)
                description += " Perfect for an extended stay to fully explore the destination.";
        }

        return description;
    }
}