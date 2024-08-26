using Application.Features.Auth.Queries.Avatar;
using Application.Features.Auth.Queries.Login;
using Application.Features.Auth.ViewModels;

namespace TailwindTemplate.Server.Endpoints;

public class Identity : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(Login, "Login")
            .MapGet(GetUserAvatar, "avatar");
    }

    public async Task<AuthResponse> Login(ISender sender, LoginQuery command)
    {
        return await sender.Send(command);
    }
    
    public async Task<string> GetUserAvatar(ISender sender)
    {
        return await sender.Send(new GetAvatarQuery());
    }
}
