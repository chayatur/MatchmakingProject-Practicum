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
using Microsoft.Extensions.Options;
using Amazon.Extensions.NETCore.Setup;

var builder = WebApplication.CreateBuilder(args);

// ✅ Load environment variables from .env file
DotNetEnv.Env.Load();

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
builder.Services.AddDbContext<ResumeContext>();
builder.Services.AddAutoMapper(typeof(MappingProFile));

// Amazon S3 configuration from environment variables
builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
    var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
    var regionValue = Environment.GetEnvironmentVariable("AWS_REGION");

    if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(regionValue))
    {
        throw new InvalidOperationException("AWS credentials or region are not configured properly in environment variables.");
    }

    var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);
    var region = Amazon.RegionEndpoint.GetBySystemName(regionValue);

    return new AmazonS3Client(credentials, region);
});

// OpenAI client from environment variable
builder.Services.AddScoped<OpenAIClient>(provider =>
{
    var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
    {
        throw new InvalidOperationException("OpenAI API key is not set in environment variables.");
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
