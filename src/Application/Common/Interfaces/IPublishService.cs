namespace Application.Common.Interfaces;

public interface IPublishService
{
    Task<bool> StartPublishAsync(string path, string command, CancellationToken ct);
}
