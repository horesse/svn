using Application.Common.Interfaces;

namespace Application.Features.Repositories.GetRepositories;

public record GetRepositoriesQuery : IRequest<List<string>>;

public class GetRepositoriesQueryHandler(ISvnService svnService) : IRequestHandler<GetRepositoriesQuery, List<string>>
{
    public Task<List<string>> Handle(GetRepositoriesQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(svnService.GetRepositories().ToList());
    }
}
