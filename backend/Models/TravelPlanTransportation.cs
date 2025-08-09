using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("travel_plan_transportation")]
public class TravelPlanTransportation
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("travel_plan_id")]
    public int TravelPlanId { get; set; }

    [ForeignKey("TravelPlanId")]
    public virtual TravelPlan TravelPlan { get; set; } = null!;

    [MaxLength(50)]
    [Column("type")]
    public string? Type { get; set; }

    [MaxLength(255)]
    [Column("from_location")]
    public string? FromLocation { get; set; }

    [MaxLength(255)]
    [Column("to_location")]
    public string? ToLocation { get; set; }

    [Column("departure_date")]
    public DateOnly? DepartureDate { get; set; }

    [Column("departure_time")]
    public TimeOnly? DepartureTime { get; set; }

    [Column("arrival_date")]
    public DateOnly? ArrivalDate { get; set; }

    [Column("arrival_time")]
    public TimeOnly? ArrivalTime { get; set; }

    [Column("cost")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Cost { get; set; }

    [MaxLength(100)]
    [Column("booking_platform")]
    public string? BookingPlatform { get; set; }

    [MaxLength(100)]
    [Column("booking_reference")]
    public string? BookingReference { get; set; }
}