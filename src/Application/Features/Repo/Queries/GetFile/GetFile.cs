using Application.Common.Interfaces;
using Domain.Models;

namespace Application.Features.Repo.Queries.GetFile;

public record GetFileQuery(string RepoName, string Path) : IRequest<RepoFile>;

public class GetFileQueryHandler(ISvnService svnService) : IRequestHandler<GetFileQuery, RepoFile>
{
    public async Task<RepoFile> Handle(GetFileQuery request, CancellationToken cancellationToken)
    {
        var path = $"{request.RepoName}/{request.Path}";
        var content = await svnService.GetFileText(path, cancellationToken);
        
        var result = new RepoFile
        {
            Content = content,
            IsBinary = content.Any(c => c == '\0'),
            LastCommit = svnService.GetLastCommit(path),
        };
        
        return result;
    }
}
