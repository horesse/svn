using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace Infrastructure.Identity;

public class AuthService(IConfiguration configuration) : IAuthService
{
    public async Task<User> AuthorizeAsync(string username, string password)
    {
        using var client = new HttpClient();
        client.BaseAddress = new Uri(configuration["Links:ServiceAuth"]!);

        var credentials = new Dictionary<string, string>
        {
            { "Login", username },
            { "Password", password },
            { "AppCode", configuration["ApplicationSettings:AppCode"]! }
        };
        
        var content = new FormUrlEncodedContent(credentials);
        
        var response = await client.PostAsync("api/authentification/Authenticate", content);
        var jsonResponse = await response.Content.ReadAsStringAsync();
        var jsonObject = JObject.Parse(jsonResponse);

        try
        {
            response.EnsureSuccessStatusCode();
            var user = GetUserFromObject(jsonObject);
            return user;
        }
        catch (Exception)
        {
            throw new AuthException(jsonObject["ExceptionMessage"]!.ToString());
        }
    }

    private static User GetUserFromObject(JObject? obj)
    {
        if (obj?["user"] == null)
            throw new Exception("Ошибка получения пользователя!");
        
        return new User
        {
            Id = decimal.Parse(obj["user"]!["Id"]!.ToString()!),
            Name = obj["user"]!["FullName"]!.ToString(),
            FullName = obj["user"]!["FullNameLong"]!.ToString(),
            UserName = obj["user"]!["AccountName"]!.ToString(),
            Email = obj["user"]!["Email"]!.ToString(),
            PersonalNumber = obj["user"]!["PersonalNumber"]!.ToString(),
            Department = obj["user"]!["Department"]!.ToString(),
            Bureau = obj["user"]!["PersonalNumber"]?.ToString(),
            Position = obj["user"]!["PersonalNumber"]!.ToString(),
            WorkplaceName = obj["user"]!["PersonalNumber"]?.ToString(),
            StructureEnterpriseId = decimal.Parse(obj["user"]!["StructureEnterpriseId"]!.ToString()),
            Roles = obj["user"]!["Roles"]!.ToString().Split(';').ToList(),
            RolesToView = obj["user"]!["AppRoles"]!.ToString().Split(';').ToList(),
            //Avatar = obj["user"]!["Photo"]?.ToString()
        };
    }
}
