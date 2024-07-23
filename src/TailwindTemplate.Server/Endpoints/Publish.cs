using Application.Features.Publish.Commands.Publish;
using Application.Features.Publish.Queries.GetProfiles;

namespace TailwindTemplate.Server.Endpoints;

public class Publish : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(GetProfiles, "profiles")
            .MapPost(BeginPublish, "start")
            ;
    }

    public async Task<List<string>> GetProfiles(ISender sender, GetProfilesQuery command)
    {
        return await sender.Send(command);
    }
    
    public async Task<bool> BeginPublish(ISender sender, PublishCommand command)
    {
        return await sender.Send(command);
    }
}
