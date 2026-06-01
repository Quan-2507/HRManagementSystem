using System;
using Microsoft.AspNetCore.Identity;
using HRManagement.Core.Enums;
using System.Collections.Generic;

namespace HRManagement.Core.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string Code { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public DateTime? JoinDate { get; set; }
        
        public string? Address { get; set; }
        public string? IdentityNumber { get; set; }
        public string? TaxCode { get; set; }
        public string? BankAccount { get; set; }
        public string? BankName { get; set; }
        
        public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;

        public Guid? DepartmentId { get; set; }
        public Department? Department { get; set; }

        public Guid? PositionId { get; set; }
        public Position? Position { get; set; }

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    }
}
