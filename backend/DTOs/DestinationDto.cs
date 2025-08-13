
namespace backend.DTOs;

public class DestinationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ContinentName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PopularityScore { get; set; }
    public string? ImageUrl { get; set; }
}