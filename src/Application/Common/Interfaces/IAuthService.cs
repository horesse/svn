using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IAuthService
{
    Task<User> AuthorizeAsync(string username, string password);
}
