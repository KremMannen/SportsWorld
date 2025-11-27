using Microsoft.EntityFrameworkCore;
using sportsworld_backend.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<SportsWorldContext>(
    options => options.UseSqlite("Data source = Databases/SportsWorldData.db")
);

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy("AllowAnyOrigin",
            policies => policies
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                );
    }
);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseStaticFiles();

app.UseCors("AllowAnyOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
