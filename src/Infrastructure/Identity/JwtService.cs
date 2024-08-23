using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Interfaces;
using Application.Common.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Identity;

public class JwtService(IConfiguration configuration) : IJwtService
{
    public string GenerateJwtToken(User user) {
        var claims = new List<Claim> {
            new("Id", user.Id.ToString(CultureInfo.InvariantCulture)),
            new("UserName", user.UserName),
            new("Name", user.Name),
            new("PersonalNumber", user.PersonalNumber),
            new("Department", user.Department),
            new("Position", user.Position),
            new("Fullname", user.FullName),
            new("WorkplaceName", user.WorkplaceName ?? string.Empty),
            new("Bureau", user.Bureau ?? string.Empty),
            new("StructureEnterpriseId", user.StructureEnterpriseId.ToString(CultureInfo.InvariantCulture)),
            new("Email", user.Email),
            new("RolesToView", string.Join(";", user.RolesToView)),
            new("Avatar", user.Avatar ?? string.Empty)
        };
        var jwtToken = new JwtSecurityToken(
            issuer: configuration["ApplicationSettings:AuthSettings:Issuer"],
            audience: configuration["ApplicationSettings:AuthSettings:Audience"],
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["ApplicationSettings:AuthSettings:SecretJwt"]!)
                ),
                SecurityAlgorithms.HmacSha256Signature)
        );
        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }
}
