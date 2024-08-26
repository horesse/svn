namespace Application.Common.Interfaces;

public interface IPortalService
{
    /// <summary>
    /// Получение аватара с портала
    /// </summary>
    /// <param name="personalNumber"></param>
    /// <returns></returns>
    Task<string> GetAvatar(string personalNumber);
}
