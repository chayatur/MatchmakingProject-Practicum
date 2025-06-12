using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Amazon.S3;
using Resume.Core.IRepository;
using Resume.Core.IServices;
using Resume.Service.Services;
using Data.Repositories;
using Resume.Data;
using Resume.Core;
using OpenAI;
using Resume.Data.Repositories;
using Resume.Core.Services;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// ✅ Load appsettings.json (required)
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// ✅ Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.OperationFilter<SwaggerFileOperationFilter>(); // ודא שהפילטר לא משפיע על הטיפוסים
});

// CORS Policy
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("MyPolicy", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// Dependency Injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IResumeFileService, ResumeFileService>();
builder.Services.AddScoped<IResumefileRepository, ResumeFileRepository>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IAIRepository, AIRepository>();
builder.Services.AddScoped<ISharingService, SharingService>(); // הוסף שורה זו
builder.Services.AddScoped<ISharingRepository, SharingRepository>(); // הוסף שורה זו
builder.Services.AddDbContext<ResumeContext>();
builder.Services.AddAutoMapper(typeof(MappingProFile));



//var connectionString = builder.Configuration["ConnectionStrings:Resume"];
//Console.WriteLine(connectionString);
//builder.Services.AddDbContext<ResumeContext>(options =>
//options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), options => options.CommandTimeout(600)));
var connectionString = builder.Configuration["ConnectionStrings:Resume"];
Console.WriteLine(connectionString);
builder.Services.AddDbContext<ResumeContext>(options =>
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), options => options.CommandTimeout(600)));
// Amazon S3 configuration
builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    var config = builder.Configuration.GetSection("AWS");
    var accessKey = config["AccessKey"];
    var secretKey = config["SecretKey"];
    var regionValue = config["Region"];

    if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(regionValue))
    {
        throw new InvalidOperationException("AWS credentials or region are not configured properly in appsettings.json.");
    }

    var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);
    var region = Amazon.RegionEndpoint.GetBySystemName(regionValue);

    return new AmazonS3Client(credentials, region);
});

// OpenAI client from appsettings.json
builder.Services.AddScoped<OpenAIClient>(provider =>
{
    var apiKey = builder.Configuration["OpenAI:ApiKey"];
    if (string.IsNullOrEmpty(apiKey))
    {
        throw new Exception("OpenAI API key is not configured in appsettings.json.");
    }
    return new OpenAIClient(apiKey);
});

var app = builder.Build();

// ✅ Use Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty;
});

// ✅ Middleware
app.UseCors("MyPolicy");
app.UseAuthorization();
app.MapControllers();

// ✅ Run the application
app.Run();
