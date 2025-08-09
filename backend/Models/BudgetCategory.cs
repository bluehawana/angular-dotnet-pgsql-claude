using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("budget_categories")]
public class BudgetCategory
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("min_daily_budget")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal? MinDailyBudget { get; set; }

    [Column("max_daily_budget")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal? MaxDailyBudget { get; set; }

    public virtual ICollection<TravelPreference> TravelPreferences { get; set; } = new List<TravelPreference>();
}