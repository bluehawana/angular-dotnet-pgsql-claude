using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("travel_plan_accommodations")]
public class TravelPlanAccommodation
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("travel_plan_id")]
    public int TravelPlanId { get; set; }

    [ForeignKey("TravelPlanId")]
    public virtual TravelPlan TravelPlan { get; set; } = null!;

    [MaxLength(255)]
    [Column("name")]
    public string? Name { get; set; }

    [MaxLength(50)]
    [Column("type")]
    public string? Type { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("check_in_date")]
    public DateOnly? CheckInDate { get; set; }

    [Column("check_out_date")]
    public DateOnly? CheckOutDate { get; set; }

    [Column("cost_per_night")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal? CostPerNight { get; set; }

    [MaxLength(100)]
    [Column("booking_platform")]
    public string? BookingPlatform { get; set; }

    [MaxLength(500)]
    [Column("booking_url")]
    public string? BookingUrl { get; set; }
}