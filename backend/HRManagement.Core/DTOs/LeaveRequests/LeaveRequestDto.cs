using System;
using System.ComponentModel.DataAnnotations;
using HRManagement.Core.Enums;

namespace HRManagement.Core.DTOs.LeaveRequests
{
    public class LeaveRequestDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Reason { get; set; }
        public LeaveStatus Status { get; set; }
        public Guid? ApproverId { get; set; }
        public string? ApproverName { get; set; }
    }

    public class LeaveRequestCreateDto
    {
        [Required]
        public LeaveType LeaveType { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public string? Reason { get; set; }
    }

    public class LeaveRequestApproveDto
    {
        [Required]
        public LeaveStatus Status { get; set; } // Approved or Rejected
    }
}
