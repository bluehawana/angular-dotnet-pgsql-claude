using backend.DTOs;

namespace backend.Services;

public interface IDestinationService
{
    Task<IEnumerable<DestinationDto>> GetAllDestinationsAsync();
    Task<DestinationDto?> GetDestinationByIdAsync(int id);
    Task<IEnumerable<DestinationDto>> GetDestinationsByContinentAsync(int continentId);
    Task<IEnumerable<DestinationDto>> GetRecommendedDestinationsAsync(TravelPreferenceDto preferences);
}