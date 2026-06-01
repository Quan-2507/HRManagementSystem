using System;

namespace HRManagement.Core.Entities
{
    public class Attendance
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid EmployeeId { get; set; }
        public ApplicationUser? Employee { get; set; }

        public DateTime Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        
        public string? Notes { get; set; }
    }
}
