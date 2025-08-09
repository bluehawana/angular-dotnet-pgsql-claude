using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models;

[Table("travel_plans")]
public class TravelPlan
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Column("travel_preference_id")]
    public int? TravelPreferenceId { get; set; }

    [ForeignKey("TravelPreferenceId")]
    public virtual TravelPreference? TravelPreference { get; set; }

    [Column("destination_id")]
    public int? DestinationId { get; set; }

    [ForeignKey("DestinationId")]
    public virtual Destination? Destination { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("total_budget")]
    [Column(TypeName = "decimal(12,2)")]
    public decimal? TotalBudget { get; set; }

    [Column("start_date")]
    public DateOnly? StartDate { get; set; }

    [Column("end_date")]
    public DateOnly? EndDate { get; set; }

    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "draft";

    [Column("ai_generated_plan")]
    [Column(TypeName = "jsonb")]
    public JsonDocument? AiGeneratedPlan { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<TravelPlanActivity> Activities { get; set; } = new List<TravelPlanActivity>();
    public virtual ICollection<TravelPlanAccommodation> Accommodations { get; set; } = new List<TravelPlanAccommodation>();
    public virtual ICollection<TravelPlanTransportation> Transportation { get; set; } = new List<TravelPlanTransportation>();
}