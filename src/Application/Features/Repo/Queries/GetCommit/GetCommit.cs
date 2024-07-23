using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetCommit;

public record GetCommitQuery(string Url, long Revision) : IRequest<Commit>;

public class GetCommitQueryHandler(ISvnService svnService) : IRequestHandler<GetCommitQuery, Commit>
{
    public Task<Commit> Handle(GetCommitQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(svnService.GetCommit(request.Url, request.Revision));
    }
}
