using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinationController : ControllerBase
{
    private readonly IDestinationService _destinationService;

    public DestinationController(IDestinationService destinationService)
    {
        _destinationService = destinationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DestinationDto>>> GetDestinations()
    {
        var destinations = await _destinationService.GetAllDestinationsAsync();
        return Ok(destinations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DestinationDto>> GetDestination(int id)
    {
        var destination = await _destinationService.GetDestinationByIdAsync(id);
        if (destination == null)
        {
            return NotFound();
        }
        return Ok(destination);
    }

    [HttpGet("continent/{continentId}")]
    public async Task<ActionResult<IEnumerable<DestinationDto>>> GetDestinationsByContinent(int continentId)
    {
        var destinations = await _destinationService.GetDestinationsByContinentAsync(continentId);
        return Ok(destinations);
    }

    [HttpPost("recommendations")]
    public async Task<ActionResult<IEnumerable<DestinationDto>>> GetRecommendations([FromBody] TravelPreferenceDto preferences)
    {
        var recommendations = await _destinationService.GetRecommendedDestinationsAsync(preferences);
        return Ok(recommendations);
    }
}