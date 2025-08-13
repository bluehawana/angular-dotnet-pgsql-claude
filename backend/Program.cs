using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Comment out database for now - will enable later
// builder.Services.AddDbContext<TravelPlannerContext>(options =>
// {
//     var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
//         ?? "Host=localhost;Database=travelplanner;Username=postgres;Password=password";
//     options.UseNpgsql(connectionString);
// });

// Add services - comment out for now
// builder.Services.AddScoped<IDestinationService, DestinationService>();
// builder.Services.AddScoped<ITravelPlanService, TravelPlanService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

app.UseRouting();
app.MapControllers();

app.Run();