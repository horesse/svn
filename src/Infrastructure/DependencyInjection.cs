using System.Text;
using Application.Common.Interfaces;
using Infrastructure.Identity;
using Infrastructure.Svn;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<ISvnService, SvnService>();
        services.AddScoped<IPublishService, PublishService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();

        services.AddAuthentication(cfg =>
        {
            cfg.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            cfg.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            cfg.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = false;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["ApplicationSettings:AuthSettings:SecretJwt"]!)),
                ValidateIssuer = true,
                ValidIssuer = configuration["ApplicationSettings:AuthSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = configuration["ApplicationSettings:AuthSettings:Audience"],
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }
}
