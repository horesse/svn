using Domain.Enums;

namespace Domain.Models;
public class RepoItem
{
    public string Name { get; set; } = null!;
    public RepoItemType Type { get; set; }
    public Commit LastCommit { get; set; } = null!;
}
