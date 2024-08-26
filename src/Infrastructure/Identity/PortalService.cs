using Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Identity;

public class PortalService(IConfiguration configuration) : IPortalService
{
    private readonly string _portalApi = configuration["Links:Portal"]!;

    /// <summary>
    /// Получение аватара с портала
    /// </summary>
    /// <param name="personalNumber"></param>
    /// <returns></returns>
    public async Task<string> GetAvatar(string personalNumber)
    {
        using var client = new HttpClient();
        client.BaseAddress = new Uri(_portalApi);

        var response = await client.GetAsync($"upload/staff/{personalNumber}.jpg");
        response.EnsureSuccessStatusCode();
        var data = await response.Content.ReadAsByteArrayAsync();

        return Convert.ToBase64String(data);
    }
}
