using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("continents")]
public class Continent
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    [Column("code")]
    public string Code { get; set; } = string.Empty;

    public virtual ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    public virtual ICollection<TravelPreference> TravelPreferences { get; set; } = new List<TravelPreference>();
}