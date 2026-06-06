using System;
using HRManagement.Core.Enums;

namespace HRManagement.Core.Entities
{
    public class LeaveRequest
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid EmployeeId { get; set; }
        public ApplicationUser? Employee { get; set; }

        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public string? Reason { get; set; }
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

        public Guid? ApproverId { get; set; }
        public ApplicationUser? Approver { get; set; }

        public string? RejectReason { get; set; }
    }
}
