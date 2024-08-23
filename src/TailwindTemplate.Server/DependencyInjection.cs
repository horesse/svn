using Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using TailwindTemplate.Server.Services;

namespace TailwindTemplate.Server;

public static class DependencyInjection
{
    public static IServiceCollection AddWebServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddRazorPages();
        
        services.AddScoped<IUser, CurrentUser>();
        services.AddExceptionHandler<CustomExceptionHandler>();

        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddEndpointsApiExplorer();

        services.AddOpenApiDocument((configure, sp) =>
        {
            configure.Title = "Server API";
        });

        return services;
    }
}
