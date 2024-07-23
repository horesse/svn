using Domain.Models;
using SharpSvn;

namespace Domain.Extensions;

public static class CommitExtensions
{
    public static Commit GetCommit(this SvnLogEventArgs entry)
    {
        return new Commit
        {
            Author = entry.Author, Date = entry.Time, Message = entry.LogMessage, Revision = entry.Revision
        };
    }
}
