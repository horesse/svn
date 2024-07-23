using System.Diagnostics;
using Application.Common.Interfaces;

namespace Infrastructure.Svn;

public class PublishService : IPublishService
{
    public async Task<bool> StartPublishAsync(string path, string command, CancellationToken ct)
    {
        var process = new Process();

        process.StartInfo.FileName = "dotnet";
        process.StartInfo.Arguments = command;

        process.StartInfo.WorkingDirectory = path;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.CreateNoWindow = true;

        process.OutputDataReceived += (sender, args) => Debug.WriteLine(args.Data);
        
        try
        {
            process.Start();
            process.BeginOutputReadLine();
            await process.WaitForExitAsync(ct);
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}
