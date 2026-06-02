using System.ComponentModel.DataAnnotations;

namespace HRManagement.Core.DTOs.Employees
{
    public class EmployeeCreateDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }
    }
}
