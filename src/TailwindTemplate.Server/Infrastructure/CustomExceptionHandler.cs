using Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace TailwindTemplate.Server.Infrastructure;

public class CustomExceptionHandler : IExceptionHandler
{
    private readonly Dictionary<Type, Func<HttpContext, Exception, Task>> _exceptionHandlers = new()
    {
        { typeof(UnauthorizedAccessException), HandleUnauthorizedAccessException },
        { typeof(AuthException), HandleAuthException },
    };
    
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var exceptionType = exception.GetType();

        if (!_exceptionHandlers.TryGetValue(exceptionType, out var handler)) return false;
        await handler.Invoke(httpContext, exception);
        return true;

    }
    
    private static async Task HandleUnauthorizedAccessException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

        await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "Unauthorized",
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1"
        });
    }

    private static async Task HandleAuthException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "InternalServerError",
            Detail = ex.Message,
            Type = "https://tools.ietf.org/html/rfc7235#section-3.1"
        });
    }
}
