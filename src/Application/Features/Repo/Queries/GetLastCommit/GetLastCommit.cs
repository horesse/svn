using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetLastCommit;

public record GetLastCommitQuery(string RepoName, string Path) : IRequest<Commit>;

public class GetLastCommitQueryHandler(ISvnService svnService) : IRequestHandler<GetLastCommitQuery, Commit>
{
    public Task<Commit> Handle(GetLastCommitQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(svnService.GetLastCommit($"{request.RepoName}/{request.Path}"));
    }
}
