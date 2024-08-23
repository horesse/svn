using Application.Features.App.Queries.GetAppInfo;
using Application.Features.App.Queries.ViewModels;

namespace TailwindTemplate.Server.Endpoints;

public class App : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetAppInfo);
    }
    
    public async Task<AppInfo> GetAppInfo(ISender sender)
    {
        return await sender.Send(new GetAppInfoQuery());
    }
}
