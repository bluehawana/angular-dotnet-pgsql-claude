using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TravelPlanController : ControllerBase
{
    private readonly ITravelPlanService _travelPlanService;

    public TravelPlanController(ITravelPlanService travelPlanService)
    {
        _travelPlanService = travelPlanService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<TravelPlanDto>> GenerateTravelPlan([FromBody] GeneratePlanRequest request)
    {
        try
        {
            var travelPlan = await _travelPlanService.GenerateAITravelPlanAsync(request);
            return Ok(travelPlan);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TravelPlanDto>> GetTravelPlan(int id)
    {
        var travelPlan = await _travelPlanService.GetTravelPlanByIdAsync(id);
        if (travelPlan == null)
        {
            return NotFound();
        }
        return Ok(travelPlan);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<TravelPlanDto>>> GetUserTravelPlans(int userId)
    {
        var travelPlans = await _travelPlanService.GetUserTravelPlansAsync(userId);
        return Ok(travelPlans);
    }

    [HttpPost]
    public async Task<ActionResult<TravelPlanDto>> SaveTravelPlan([FromBody] SaveTravelPlanRequest request)
    {
        try
        {
            var savedPlan = await _travelPlanService.SaveTravelPlanAsync(request);
            return CreatedAtAction(nameof(GetTravelPlan), new { id = savedPlan.Id }, savedPlan);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TravelPlanDto>> UpdateTravelPlan(int id, [FromBody] UpdateTravelPlanRequest request)
    {
        try
        {
            var updatedPlan = await _travelPlanService.UpdateTravelPlanAsync(id, request);
            if (updatedPlan == null)
            {
                return NotFound();
            }
            return Ok(updatedPlan);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTravelPlan(int id)
    {
        var success = await _travelPlanService.DeleteTravelPlanAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}