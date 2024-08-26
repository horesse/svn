using Application.Common.Interfaces;

namespace Application.Common.Models;

public class User
{
    public decimal Id { get; set; }
    public string UserName { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string PersonalNumber { get; set; } = null!;
    public string Department { get; set; } = null!;
    public string? Bureau { get; set; }
    public string Position { get; set; } = null!;
    public string? WorkplaceName { get; set; }
    public decimal StructureEnterpriseId { get; set; }
    public List<string> Roles { get; set; } = null!;
    public List<string> RolesToView { get; set; } = null!;
    public string? Avatar { get; set; }
}
