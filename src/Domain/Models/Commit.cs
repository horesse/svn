namespace Domain.Models;
public class Commit
{
    public long Revision { get; set; }
    public string Author { get; set; } = null!;
    public string Message { get; set; } = null!;
    public DateTime Date { get; set; }
}
