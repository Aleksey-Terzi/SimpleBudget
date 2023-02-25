using Microsoft.AspNetCore.Authentication.Cookies;

using SimpleBudget.Data;
using SimpleBudget.Web;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.LoginPath = "/users/login";
        o.ExpireTimeSpan = new TimeSpan(30, 0, 0, 0);
    });

Constants.BudgetConnectionString = builder.Configuration.GetConnectionString("Budget");

TimeHelper.SetTimeZone(builder.Configuration.GetSection("Settings")["TimeZone"]);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions()
{
    OnPrepareResponse = context =>
    {
        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
        context.Context.Response.Headers.Add("Expires", "-1");
    }
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "dictionaries",
    pattern: "dictionaries",
    defaults: new { controller = "Dictionaries", action="Index" });

app.MapControllerRoute(
    name: "dictionaries",
    pattern: "dictionaries/{controller}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Payments}/{action=Index}/{id?}");

app.Run();