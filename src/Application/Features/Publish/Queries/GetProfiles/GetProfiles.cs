using Application.Common.Interfaces;

namespace Application.Features.Publish.Queries.GetProfiles;

public class GetProfilesQuery : IRequest<List<string>>
{
    public string RepoName { get; set; } = null!;
    public string Path { get; set; } = null!;
    public string ProjectName { get; set; } = null!;
};

public class GetProfilesQueryHandler(ISvnService svnService) : IRequestHandler<GetProfilesQuery, List<string>>
{
    public Task<List<string>> Handle(GetProfilesQuery request, CancellationToken cancellationToken)
    {
        var url = $"{request.RepoName}/{request.Path}/{request.ProjectName}/Properties/";
        var profiles = svnService.GetRepoItems(url);

        return Task.FromResult(profiles.Select(c => c.Name).ToList());
    }
}


