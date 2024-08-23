using Application.Features.Auth.Queries.Login;
using Application.Features.Auth.ViewModels;

namespace TailwindTemplate.Server.Endpoints;

public class Identity : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(Login, "Login");
    }

    public async Task<AuthResponse> Login(ISender sender, LoginQuery command)
    {
        var result = await sender.Send(command);
            
        return result;
    } 
}
