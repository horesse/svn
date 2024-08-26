using System.Reflection;
using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Common.Behaviours;

public class AuthorizationBehaviour<TRequest, TResponse>(
    IUser user) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>().ToList();

        if (authorizeAttributes.Any())
        {
            if (user.Id == null)
            {
                throw new UnauthorizedAccessException();
            }
        }

        // Пользователь авторизован / авторизация не требуется
        return await next();
    }
}
