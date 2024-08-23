using Application.Features.App.Queries.ViewModels;
using Microsoft.Extensions.Configuration;

namespace Application.Features.App.Queries.GetAppInfo;

public class GetAppInfoQuery : IRequest<AppInfo>;

public class GetAppInfoQueryHandler(IConfiguration configuration) : IRequestHandler<GetAppInfoQuery, AppInfo>
{
    public Task<AppInfo> Handle(GetAppInfoQuery request, CancellationToken cancellationToken)
    {
        var result = new AppInfo
        {
            AppCode = configuration["ApplicationSettings:AppCode"]!,
            AppName = configuration["ApplicationSettings:AppName"]!
        };

        return Task.FromResult(result);
    }
}
