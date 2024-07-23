using System.Collections.ObjectModel;
using System.Net;
using System.Runtime.CompilerServices;
using Application.Common.Interfaces;
using Domain.Enums;
using Domain.Extensions;
using Domain.Models;
using Microsoft.Extensions.Configuration;
using SharpSvn;

namespace Infrastructure.Svn;

public class SvnService(IConfiguration configuration) : ISvnService
{
    private readonly string _svnUrl = configuration.GetConnectionString("svn")!;

    public IEnumerable<RepoItem> GetRepoItems(string url)
    {
        using var client = new SvnClient();
        var baseUrl = _svnUrl + url;

        client.GetList(new Uri(baseUrl), out var list);

        foreach (var item in list)
        {
            var path = item.Path;
            SvnLogArgs logArgs = new()
            {
                Limit = 1, Range = new SvnRevisionRange(SvnRevision.Head, SvnRevision.None),
            };

            client.GetLog(new Uri($"{baseUrl}/{path}"), logArgs, out var logItems);

            foreach (var logItem in logItems)
            {
                yield return new RepoItem
                {
                    Name = item.Path,
                    LastCommit = logItem.GetCommit(),
                    Type = item.Entry.NodeKind == SvnNodeKind.Directory ? RepoItemType.Folder : RepoItemType.File
                };
            }
        }
    }

    public long GetLastRevision(string title)
    {
        var url = _svnUrl + title;
        using var svnClient = new SvnClient();
        svnClient.GetInfo(new Uri(url), out var info);
        
        return info.LastChangeRevision;
    }

    public async Task<string> GetFileText(string url, CancellationToken ct)
    {
        return await GetFileText(new SvnUriTarget(new Uri(_svnUrl + url)), false, ct);
    }

    private static async Task<string> GetFileText(SvnUriTarget target, bool ignoreException, CancellationToken ct = default)
    {
        try
        {
            using var client = new SvnClient();

            using var stream = new MemoryStream();
            client.Write(target, stream);
            stream.Position = 0;

            using var reader = new StreamReader(stream);

            var content = await reader.ReadToEndAsync(ct);
            return content;
        }
        catch (Exception)
        {
            if (ignoreException)
                return string.Empty;
            throw;
        }
    }

    public IEnumerable<Commit> GetCommits(string url)
    {
        var svnUrl = _svnUrl + url;

        using var client = new SvnClient();

        client.GetLog(new Uri(svnUrl), out Collection<SvnLogEventArgs> logEntries);

        foreach (var entry in logEntries)
        {
            yield return entry.GetCommit();
        }
    }

    public Commit GetCommit(string repoName, long revision)
    {
        var svnUrl = _svnUrl + repoName;
        using var client = new SvnClient();

        var logArgs = revision > 0
            ? new SvnLogArgs { Start = revision, End = revision }
            : new SvnLogArgs { Range = new SvnRevisionRange(SvnRevision.Head, SvnRevision.None), };

        Commit? result = null;

        client.Log(new Uri(svnUrl), logArgs, LogHandler);

        return result ?? throw new Exception("Ошибка получения коммита!");

        void LogHandler(object? sender, SvnLogEventArgs e)
        {
            result = e.GetCommit();
            e.Cancel = true;
        }
    }

    public async Task<List<CommitChange>> GetChangesInRevision(string url, long revision, CancellationToken ct)
    {
        var svnUrl = _svnUrl + url;
        using var client = new SvnClient();
        var logArgs = new SvnLogArgs {Start = revision, End = revision};
        client.GetLog(new Uri(svnUrl), logArgs, out var logEntries);

        List<CommitChange> collection = [];
        
        foreach (var change in logEntries.SelectMany(c => c.ChangedPaths))
        {
            var targetBefore = new SvnUriTarget(new Uri($"{svnUrl}/{change.Path}"), revision - 1);
            var targetAfter = new SvnUriTarget(new Uri($"{svnUrl}/{change.Path}"), revision);

            var commitChange = new CommitChange
            {
                Action = change.Action.ToString(),
                OldContent = await GetFileText(targetBefore, true, ct),
                NewContent = await GetFileText(targetAfter, true, ct),
                File = change.Path,
                Type = change.NodeKind == SvnNodeKind.Directory ? RepoItemType.Folder : RepoItemType.File
            };
            collection.Add(commitChange);
        }

        return collection;
    }

    public Commit GetLastCommit(string repoName)
    {
        var url = _svnUrl + repoName;

        using var client = new SvnClient();

        if (client.GetInfo(url, out var info))
        {
            return GetCommit(repoName, -1);
        }

        throw new Exception("Проблемы с получением последней ревизии");
    }

    public RepoInfo GetRepoInfo(string repoUrl)
    {
        var url = _svnUrl + repoUrl;
        
        using var client = new SvnClient();

        var logArgs = new SvnLogArgs
        {
            Range = new SvnRevisionRange(SvnRevision.Head, SvnRevision.Zero)
        };


        if (!client.GetLog(new Uri(url), logArgs, out var logs))
        {
            throw new Exception("Ошибка получения информации о репозитории!");
        }

        var repoInfo = new RepoInfo
        {
            CommitsCount = logs.Count, SvnUrl = repoUrl, Authors = [], DateCreate = logs.Last().Time
        };

        foreach (var log in logs)
        {
            if (!repoInfo.Authors.Contains(log.Author) && log.Author != "borodzichas")
                repoInfo.Authors.Add(log.Author);
        }
            
        return repoInfo;
    }

    public IEnumerable<string> GetRepositories()
    {
        List<string> result = [];
        using var client = new SvnClient();

        var listArgs = new SvnListArgs { Depth = SvnDepth.Children };
        client.Authentication.DefaultCredentials = new NetworkCredential("polhovskiyva", "1378403t26P");

        var done = false;

        while (!done)
        {
            try
            {
                if (!client.GetList(new Uri("http://repo-server.atlant.com.by:18080/svn/"), listArgs,
                        out var listResults))
                {
                    throw new Exception("Ошибка получения репозиториев!");
                }

                foreach (var item in listResults)
                {
                    if (item.Entry.NodeKind == SvnNodeKind.Directory)
                    {
                        result.Add(item.Name);
                        done = true;
                    }

                }
            }
            catch (SvnRepositoryIOException e)
            {
                throw new Exception(e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        return result;
    }

    public bool CheckOut(string repoUrl, string folder)
    {
        var url = new Uri($"{_svnUrl}/{repoUrl}");

        using var svnClient = new SvnClient();
        return svnClient.CheckOut(url, folder, out var result);
    }
}
