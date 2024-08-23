namespace Application.Features.Auth.ViewModels;

public class AuthResponse
{
    public string AccessToken { get; set; } = null!;
    public bool IsAuth { get; set; }
}
