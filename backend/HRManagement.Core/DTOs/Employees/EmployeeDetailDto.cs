using System;
using HRManagement.Core.Enums;

namespace HRManagement.Core.DTOs.Employees
{
    public class EmployeeDetailDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? JoinDate { get; set; }
        public string? Address { get; set; }
        public string? PersonalEmail { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Gender { get; set; }
        public string? MaritalStatus { get; set; }
        public string? EmergencyContact { get; set; }
        public string? IdentityNumber { get; set; }
        public DateTime? IdentityIssueDate { get; set; }
        public string? IdentityIssuePlace { get; set; }
        public string? TaxCode { get; set; }
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
        public EmployeeStatus Status { get; set; }
        public string? DepartmentName { get; set; }
        public string? PositionTitle { get; set; }
    }
}
