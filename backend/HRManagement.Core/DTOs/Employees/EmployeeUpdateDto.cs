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

        public string? PersonalEmail { get; set; }
        public string? Gender { get; set; }
        public string? MaritalStatus { get; set; }
        public string? EmergencyContact { get; set; }
        public string? IdentityNumber { get; set; }
        public DateTime? IdentityIssueDate { get; set; }
        public string? IdentityIssuePlace { get; set; }
        public string? TaxCode { get; set; }
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
    }
}
