using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using SimpleBudget.API;
using SimpleBudget.API.Middleware;
using SimpleBudget.API.Options;
using SimpleBudget.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(x =>
{
    x.SwaggerDoc("v1", new OpenApiInfo { Title = "SimpleBudget", Version = "v1" });
    x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    x.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddDbContext<BudgetDbContext>(x => x.UseSqlServer(builder.Configuration.GetConnectionString("Budget")));

var jwtSection = builder.Configuration.GetSection("JWT");
var jwt = jwtSection.Get<JwtOptions>();
if (string.IsNullOrEmpty(jwt?.Key))
    throw new ArgumentNullException("JWT");

builder.Services.Configure<JwtOptions>(jwtSection);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<AccountSearch>();
builder.Services.AddScoped<AccountStore>();
builder.Services.AddScoped<CategorySearch>();
builder.Services.AddScoped<CategoryStore>();
builder.Services.AddScoped<CompanySearch>();
builder.Services.AddScoped<CompanyStore>();
builder.Services.AddScoped<CurrencySearch>();
builder.Services.AddScoped<CurrencyStore>();
builder.Services.AddScoped<CurrencyRateSearch>();
builder.Services.AddScoped<CurrencyRateStore>();
builder.Services.AddScoped<PaymentSearch>();
builder.Services.AddScoped<PaymentStore>();
builder.Services.AddScoped<PersonSearch>();
builder.Services.AddScoped<PersonStore>();
builder.Services.AddScoped<PlanPaymentSearch>();
builder.Services.AddScoped<PlanPaymentStore>();
builder.Services.AddScoped<ReportSearch>();
builder.Services.AddScoped<TaxRateSearch>();
builder.Services.AddScoped<TaxRateStore>();
builder.Services.AddScoped<TaxSettingSearch>();
builder.Services.AddScoped<TaxSettingStore>();
builder.Services.AddScoped<TaxYearSearch>();
builder.Services.AddScoped<TaxYearStore>();
builder.Services.AddScoped<UserSearch>();
builder.Services.AddScoped<UserStore>();
builder.Services.AddScoped<WalletSearch>();
builder.Services.AddScoped<WalletStore>();

builder.Services.AddScoped<CompanyService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<PaymentSearchService>();
builder.Services.AddScoped<PaymentUpdateService>();
builder.Services.AddScoped<PlanPaymentSearchService>();
builder.Services.AddScoped<PlanPaymentUpdateService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<TaxService>();
builder.Services.AddScoped<UnpaidTaxService>();
builder.Services.AddScoped<SummaryReportService>();
builder.Services.AddScoped<MonthlyReportService>();

builder.Services.AddCors();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });

    app.UseCors(o =>
    {
        o.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:3000");
    });
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.Run();
