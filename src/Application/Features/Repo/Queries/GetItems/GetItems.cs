using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetItems;

public record GetItemsQuery(string RepoName, string Path) : IRequest<List<RepoItem>>;

public class GetItemsQueryHandler(ISvnService svnService) : IRequestHandler<GetItemsQuery, List<RepoItem>>
{
    public Task<List<RepoItem>> Handle(GetItemsQuery request, CancellationToken cancellationToken)
    {
        var data = svnService.GetRepoItems($"{request.RepoName}/{request.Path}");

        return Task.FromResult(data.Where(c => !string.IsNullOrEmpty(c.Name)).OrderByDescending(c => c.Type).ToList());
    }
}
