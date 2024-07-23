using Microsoft.Extensions.Configuration;

namespace Application.Features.Repo.Queries.GetFullPath;

public record GetFullPathQuery(string RepoName, string Path) : IRequest<string>;

public class GetFullPathQueryHandler(IConfiguration configuration) : IRequestHandler<GetFullPathQuery, string>
{
    public Task<string> Handle(GetFullPathQuery request, CancellationToken cancellationToken)
    {
        var svnUrl = configuration.GetConnectionString("svn");
        return Task.FromResult($"{svnUrl}{request.RepoName}/{request.Path}");
    }
}
