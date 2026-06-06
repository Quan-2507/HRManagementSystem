using System;

namespace HRManagement.Core.Entities
{
    public class EmployeeKpi
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid EmployeeId { get; set; }
        public ApplicationUser? Employee { get; set; }

        public string Period { get; set; } = string.Empty; // Format: "MM/yyyy"
        public double Score { get; set; }
        
        public string? ReviewerComment { get; set; }
        public Guid? ReviewerId { get; set; }
        public ApplicationUser? Reviewer { get; set; }

        public int Status { get; set; } = 1; // 1 = Draft, 2 = Submitted, 3 = Approved
    }
}
