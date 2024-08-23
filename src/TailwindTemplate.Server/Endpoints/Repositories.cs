using Application.Features.Repo.Queries.GetBranches;
using Application.Features.Repo.Queries.GetFullPath;
using Application.Features.Repo.Queries.GetItems;
using Application.Features.Repo.Queries.GetRepoInfo;
using Application.Features.Repo.Queries.GetTags;
using Application.Features.Repositories.GetRepositories;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;

namespace TailwindTemplate.Server.Endpoints;

public class Repositories : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetRepositories)
            .MapGet(GetBranches, "branches/{repoName}")
            .MapGet(GetTags, "tags/{repoName}")
            .MapPost(GetItems, "items")
            .MapPost(GetSvnUrl, "path")
            .MapPost(GetRepoInfo, "info")
            ;
    }

    public async Task<List<string>> GetRepositories(ISender sender)
    {
        return await sender.Send(new GetRepositoriesQuery());
    }
    
    public async Task<List<Branch>> GetBranches(ISender sender, string repoName)
    {
        return await sender.Send(new GetBranchesQuery(repoName));
    }
    
    public async Task<List<Branch>> GetTags(ISender sender, string repoName)
    {
        return await sender.Send(new GetTagsQuery(repoName));
    }

    public async Task<List<RepoItem>> GetItems(ISender sender, GetItemsQuery command)
    {
        return await sender.Send(command);
    }

    public async Task<string> GetSvnUrl(ISender sender, GetFullPathQuery command)
    {
        return await sender.Send(command);
    }

    public async Task<RepoInfo> GetRepoInfo(ISender sender, GetRepoInfoQuery command)
    {
        return await sender.Send(command);
    }
}
