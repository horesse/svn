using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Auth.ViewModels;

namespace Application.Features.Auth.Queries.Login;

public record LoginQuery(string Username, string Password) : IRequest<AuthResponse>;

public class LoginQueryHandler(IAuthService authService, IJwtService jwtService) : IRequestHandler<LoginQuery, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await authService.AuthorizeAsync(request.Username, request.Password);

        var jwt = jwtService.GenerateJwtToken(user);
        
        return new AuthResponse {AccessToken = jwt, IsAuth = true};
    }
}
