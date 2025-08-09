using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("travel_preferences")]
public class TravelPreference
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [MaxLength(20)]
    [Column("gender")]
    public string? Gender { get; set; }

    [MaxLength(20)]
    [Column("age_range")]
    public string? AgeRange { get; set; }

    [Column("budget_category_id")]
    public int? BudgetCategoryId { get; set; }

    [ForeignKey("BudgetCategoryId")]
    public virtual BudgetCategory? BudgetCategory { get; set; }

    [Column("preferred_continent_id")]
    public int? PreferredContinentId { get; set; }

    [ForeignKey("PreferredContinentId")]
    public virtual Continent? PreferredContinent { get; set; }

    [Column("travel_duration_days")]
    public int? TravelDurationDays { get; set; }

    [MaxLength(50)]
    [Column("accommodation_type")]
    public string? AccommodationType { get; set; }

    [MaxLength(50)]
    [Column("transportation_preference")]
    public string? TransportationPreference { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<TravelPlan> TravelPlans { get; set; } = new List<TravelPlan>();
}