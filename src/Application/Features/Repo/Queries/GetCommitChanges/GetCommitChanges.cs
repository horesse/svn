using Application.Common.Interfaces;
using Domain.Enums;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetCommitChanges;

public record GetCommitChangesQuery(string Title, long Revision) : IRequest<List<CommitChange>>;

public class GetCommitChangesQueryHandler(ISvnService svnService) : IRequestHandler<GetCommitChangesQuery, List<CommitChange>>
{
    public async Task<List<CommitChange>> Handle(GetCommitChangesQuery request, CancellationToken cancellationToken)
    {
        var changes = await svnService.GetChangesInRevision(request.Title, request.Revision, cancellationToken);
        return changes;
    }
}
