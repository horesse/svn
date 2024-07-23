namespace Domain.Models;

public class RepoInfo
{
    public int CommitsCount { get; set; }
    public List<string> Authors { get; set; } = null!;
    public string SvnUrl { get; set; } = null!;
    public DateTime DateCreate { get; set; }
}
