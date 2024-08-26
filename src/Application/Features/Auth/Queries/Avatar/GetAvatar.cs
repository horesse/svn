using Application.Common.Interfaces;

namespace Application.Features.Auth.Queries.Avatar;

public class GetAvatarQuery : IRequest<string>;

public class GetAvatarQueryHandler(IPortalService portalService, IUser user) : IRequestHandler<GetAvatarQuery, string>
{
    public Task<string> Handle(GetAvatarQuery request, CancellationToken cancellationToken)
    {
        try
        {
            Guard.Against.NullOrEmpty(user.PersonalNumber);

            return portalService.GetAvatar(user.PersonalNumber);
        }
        catch (Exception)
        {
            throw new Exception("Ошибка получения аватара.");
        }
    }
}
