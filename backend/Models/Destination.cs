using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("destinations")]
public class Destination
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("country")]
    public string Country { get; set; } = string.Empty;

    [Column("continent_id")]
    public int ContinentId { get; set; }

    [ForeignKey("ContinentId")]
    public virtual Continent Continent { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("popularity_score")]
    public int PopularityScore { get; set; } = 0;

    [MaxLength(500)]
    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<TravelPlan> TravelPlans { get; set; } = new List<TravelPlan>();
}