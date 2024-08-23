using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken(User user);
}
