using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class TravelPlannerContext : DbContext
{
    public TravelPlannerContext(DbContextOptions<TravelPlannerContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Continent> Continents { get; set; }
    public DbSet<Destination> Destinations { get; set; }
    public DbSet<BudgetCategory> BudgetCategories { get; set; }
    public DbSet<TravelPreference> TravelPreferences { get; set; }
    public DbSet<TravelPlan> TravelPlans { get; set; }
    public DbSet<TravelPlanActivity> TravelPlanActivities { get; set; }
    public DbSet<TravelPlanAccommodation> TravelPlanAccommodations { get; set; }
    public DbSet<TravelPlanTransportation> TravelPlanTransportation { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Continent>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Continent>()
            .HasIndex(c => c.Code)
            .IsUnique();

        modelBuilder.Entity<BudgetCategory>()
            .HasIndex(bc => bc.Name)
            .IsUnique();

        modelBuilder.Entity<Destination>()
            .HasIndex(d => d.PopularityScore);

        modelBuilder.Entity<TravelPlan>()
            .HasIndex(tp => tp.Status);

        modelBuilder.Entity<User>()
            .HasMany(u => u.TravelPreferences)
            .WithOne(tp => tp.User)
            .HasForeignKey(tp => tp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.TravelPlans)
            .WithOne(tp => tp.User)
            .HasForeignKey(tp => tp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Continent>()
            .HasMany(c => c.Destinations)
            .WithOne(d => d.Continent)
            .HasForeignKey(d => d.ContinentId);

        modelBuilder.Entity<Continent>()
            .HasMany(c => c.TravelPreferences)
            .WithOne(tp => tp.PreferredContinent)
            .HasForeignKey(tp => tp.PreferredContinentId);

        modelBuilder.Entity<BudgetCategory>()
            .HasMany(bc => bc.TravelPreferences)
            .WithOne(tp => tp.BudgetCategory)
            .HasForeignKey(tp => tp.BudgetCategoryId);

        modelBuilder.Entity<TravelPreference>()
            .HasMany(tp => tp.TravelPlans)
            .WithOne(tpl => tpl.TravelPreference)
            .HasForeignKey(tpl => tpl.TravelPreferenceId);

        modelBuilder.Entity<Destination>()
            .HasMany(d => d.TravelPlans)
            .WithOne(tp => tp.Destination)
            .HasForeignKey(tp => tp.DestinationId);

        modelBuilder.Entity<TravelPlan>()
            .HasMany(tp => tp.Activities)
            .WithOne(tpa => tpa.TravelPlan)
            .HasForeignKey(tpa => tpa.TravelPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TravelPlan>()
            .HasMany(tp => tp.Accommodations)
            .WithOne(tpa => tpa.TravelPlan)
            .HasForeignKey(tpa => tpa.TravelPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TravelPlan>()
            .HasMany(tp => tp.Transportation)
            .WithOne(tpt => tpt.TravelPlan)
            .HasForeignKey(tpt => tpt.TravelPlanId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}