using System;

namespace HRManagement.Core.Entities
{
    public class Candidate
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        
        public string AppliedPosition { get; set; } = string.Empty;
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
        
        // 1: Mới, 2: Đang phỏng vấn, 3: Đậu (Pass), 4: Trượt (Fail)
        public int Status { get; set; } = 1; 

        // True if the candidate has been successfully converted into an ApplicationUser
        public bool IsOnboarded { get; set; } = false;
        
        public Guid? OnboardedEmployeeId { get; set; }
        public ApplicationUser? OnboardedEmployee { get; set; }
        
        public string? Notes { get; set; }
    }
}
