namespace Application.Common.Security;

/// <summary>
/// Указывает класс, к которому применяется этот атрибут, требующий авторизации.
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public class AuthorizeAttribute : Attribute
{
    /// <summary>
    /// Инициализирует новый экземпляр класса <see cref="AuthorizeAttribute"/>.
    /// </summary>
    public AuthorizeAttribute() { }

    /// <summary>
    /// Возвращает или задает разделенный запятыми список ролей, которым разрешен доступ к ресурсу.
    /// </summary>
    public string Roles { get; set; } = string.Empty;

    /// <summary>
    /// Получает или задает имя политики, определяющей доступ к ресурсу.
    /// </summary>
    public string Policy { get; set; } = string.Empty;
}
