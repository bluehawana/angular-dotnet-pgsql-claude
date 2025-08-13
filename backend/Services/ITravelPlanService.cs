using backend.DTOs;

namespace backend.Services;

public interface ITravelPlanService
{
    Task<TravelPlanDto> GenerateAITravelPlanAsync(GeneratePlanRequest request);
    Task<TravelPlanDto?> GetTravelPlanByIdAsync(int id);
    Task<IEnumerable<TravelPlanDto>> GetUserTravelPlansAsync(int userId);
    Task<TravelPlanDto> SaveTravelPlanAsync(SaveTravelPlanRequest request);
    Task<TravelPlanDto?> UpdateTravelPlanAsync(int id, UpdateTravelPlanRequest request);
    Task<bool> DeleteTravelPlanAsync(int id);
}