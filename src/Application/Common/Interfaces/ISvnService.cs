using System.Runtime.CompilerServices;
using Domain.Models;

namespace Application.Common.Interfaces;
public interface ISvnService
{
    IEnumerable<RepoItem> GetRepoItems(string url);
    long GetLastRevision(string title);
    Task<string> GetFileText(string url, CancellationToken ct);
    IEnumerable<Commit> GetCommits(string url);
    Commit GetCommit(string repoName, long revision);
    Task<List<CommitChange>> GetChangesInRevision(string url, long revision,
        CancellationToken ct);

    Commit GetLastCommit(string repoName);
    RepoInfo GetRepoInfo(string repoUrl);
    IEnumerable<string> GetRepositories();
    bool CheckOut(string repoUrl, string folder);
}
