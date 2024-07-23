using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetCommits;

public class GetCommitsQuery : IRequest<List<Commit>>
{
    public string App { get; set; } = null!;
    public string Url { get; set; } = null!;
    public int Page { get; set; }
}

public class GetCommitsQueryHandler(ISvnService svnService) : IRequestHandler<GetCommitsQuery, List<Commit>>
{
    public Task<List<Commit>> Handle(GetCommitsQuery request, CancellationToken cancellationToken)
    {
        var pageSize = 20;
        
        var url = $"{request.App}/{request.Url}";
        return Task.FromResult(svnService.GetCommits(url).Skip(request.Page * pageSize).Take(pageSize).ToList());
    }
}
