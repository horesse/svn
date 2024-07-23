using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetBranches;

public record GetBranchesQuery(string RepositoryName) : IRequest<List<Branch>>;

public class GetBranchesQueryHandler(ISvnService svnService) : IRequestHandler<GetBranchesQuery, List<Branch>>
{
    public Task<List<Branch>> Handle(GetBranchesQuery request, CancellationToken cancellationToken)
    {
        var branchesFromSvn = svnService.GetRepoItems(request.RepositoryName + "/branches")
            .Where(c => !string.IsNullOrEmpty(c.Name))
            .Select(c => new Branch { Title = c.Name, Url = $"branches/{c.Name}" });

        var trunk = new Branch { Title = "trunk", Url = "trunk" };
        
        List<Branch> branches = [trunk, ..branchesFromSvn];

        return Task.FromResult(branches);
    }
}
