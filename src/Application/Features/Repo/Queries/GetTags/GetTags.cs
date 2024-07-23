using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetTags;

public record GetTagsQuery(string RepositoryName) : IRequest<List<Branch>>;

public class GetTagsQueryHandler(ISvnService svnService) : IRequestHandler<GetTagsQuery, List<Branch>>
{
    public Task<List<Branch>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = svnService.GetRepoItems(request.RepositoryName + "/tags")
            .Where(c => !string.IsNullOrEmpty(c.Name))
            .Select(c => new Branch { Title = c.Name, Url = $"tags/{c.Name}" }).ToList();
        
        return Task.FromResult(tags);
    }
}
