using Application.Common.Interfaces;
using Infrastructure.Svn;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<ISvnService, SvnService>();
        services.AddScoped<IPublishService, PublishService>();

        return services;
    }
}
