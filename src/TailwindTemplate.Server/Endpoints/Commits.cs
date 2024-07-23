using Application.Features.Repo.Queries.GetCommit;
using Application.Features.Repo.Queries.GetCommitChanges;
using Application.Features.Repo.Queries.GetCommits;
using Application.Features.Repo.Queries.GetLastCommit;
using Domain.Models;

namespace TailwindTemplate.Server.Endpoints;

public class Commits : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(GetLastCommit, "last")
            .MapPost(GetCommits)
            .MapGet(GetChanges, "changes/{repoName}/{revision}")
            .MapGet(GetCommit, "{repoName}/{revision}")
            ;
    }

    public async Task<Commit> GetLastCommit(ISender sender, GetLastCommitQuery command)
    {
        return await sender.Send(command);
    }
    
    public async Task<List<Commit>> GetCommits(ISender sender, GetCommitsQuery command)
    {
        return await sender.Send(command);
    }
    
    public async Task<List<CommitChange>> GetChanges(ISender sender, string repoName, long revision)
    {
        return await sender.Send(new GetCommitChangesQuery(repoName, revision));
    }
    
    public async Task<Commit> GetCommit(ISender sender, string repoName, long revision)
    {
        return await sender.Send(new GetCommitQuery(repoName, revision));
    }
}
