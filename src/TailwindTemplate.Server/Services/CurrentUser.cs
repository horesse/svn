using Application.Common.Interfaces;
using Domain.Constants;

namespace TailwindTemplate.Server.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : IUser
{
    public decimal? Id => GetId();

    private decimal? GetId()
    {
        if (decimal.TryParse(httpContextAccessor.HttpContext?.User?.FindFirst(ClaimConstants.Subject)?.Value,
                out var id))
            return id;

        return null;
    }
}
