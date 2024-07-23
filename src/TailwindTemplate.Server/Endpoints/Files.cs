using Application.Features.Repo.Queries.GetFile;
using Domain.Models;

namespace TailwindTemplate.Server.Endpoints;

public class Files : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(GetFileContent, "file")
            ;
    }

    public async Task<RepoFile> GetFileContent(ISender sender, GetFileQuery command)
    {
        return await sender.Send(command);
    }
}
