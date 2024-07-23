namespace Domain.Models;

public class RepoFile
{
    public string Content { get; set; } = null!;
    public bool IsBinary { get; set; }
    public Commit LastCommit { get; set; } = null!;
}
