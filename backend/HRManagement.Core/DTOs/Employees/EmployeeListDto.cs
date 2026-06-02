using System;
using HRManagement.Core.Enums;

namespace HRManagement.Core.DTOs.Employees
{
    public class EmployeeListDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? DepartmentName { get; set; }
        public string? PositionTitle { get; set; }
        public EmployeeStatus Status { get; set; }
    }
}
