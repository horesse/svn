using Application.Common.Interfaces;

namespace Application.Features.Publish.Commands.Publish;

public class PublishCommand : IRequest<bool>
{
    public string RepoName { get; set; } = null!;
    public string Path { get; set; } = null!;
}

public class PublishCommandHandler(IPublishService publishService, ISvnService svnService)
    : IRequestHandler<PublishCommand, bool>
{
    public async Task<bool> Handle(PublishCommand request, CancellationToken cancellationToken)
    {
        var tempFolder = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

        Directory.CreateDirectory(tempFolder);

        if (!svnService.CheckOut($"{request.RepoName}/{request.Path}", tempFolder))
            throw new Exception("Не удалось выгрузить проект с сервера!");


        await publishService.StartPublishAsync(tempFolder,
            "publish /p:Configuration=Release /p:PublishProfile=TestServer", cancellationToken);

        Directory.Delete(tempFolder, true);

        return true;
    }
}


