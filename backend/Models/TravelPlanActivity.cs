using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("travel_plan_activities")]
public class TravelPlanActivity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("travel_plan_id")]
    public int TravelPlanId { get; set; }

    [ForeignKey("TravelPlanId")]
    public virtual TravelPlan TravelPlan { get; set; } = null!;

    [Column("day_number")]
    public int? DayNumber { get; set; }

    [MaxLength(255)]
    [Column("activity_name")]
    public string? ActivityName { get; set; }

    [MaxLength(50)]
    [Column("activity_type")]
    public string? ActivityType { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("estimated_cost")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal? EstimatedCost { get; set; }

    [MaxLength(255)]
    [Column("location")]
    public string? Location { get; set; }

    [Column("start_time")]
    public TimeOnly? StartTime { get; set; }

    [Column("duration_minutes")]
    public int? DurationMinutes { get; set; }
}