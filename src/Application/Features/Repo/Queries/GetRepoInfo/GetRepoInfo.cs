using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetRepoInfo;

public class GetRepoInfoQuery : IRequest<RepoInfo>
{
    public string RepoName { get; set; } = null!;
    public string Branch { get; set; } = null!;
}

public class GetRepoInfoQueryHandler(ISvnService svnService) : IRequestHandler<GetRepoInfoQuery, RepoInfo>
{
    public Task<RepoInfo> Handle(GetRepoInfoQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(svnService.GetRepoInfo($"{request.RepoName}/{request.Branch}"));
    }
}
