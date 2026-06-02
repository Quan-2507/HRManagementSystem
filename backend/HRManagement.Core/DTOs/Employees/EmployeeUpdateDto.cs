using System;
using System.ComponentModel.DataAnnotations;

namespace HRManagement.Core.DTOs.Employees
{
    public class EmployeeUpdateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public Guid? DepartmentId { get; set; }
        
        public Guid? PositionId { get; set; }
        
        public string? Address { get; set; }
    }
}
