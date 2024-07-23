using Domain.Enums;

namespace Domain.Models;

public class CommitChange
{
    public string Action { get; set; } = null!;
    public string OldContent { get; set; } = null!;
    public string NewContent { get; set; } = null!;
    public string File { get; set; } = null!;
    public RepoItemType Type { get; set; }
}
