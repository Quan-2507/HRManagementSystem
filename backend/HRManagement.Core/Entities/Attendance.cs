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

        public double? CheckInLatitude { get; set; }
        public double? CheckInLongitude { get; set; }
        public string? CheckInLocationName { get; set; }

        public double? CheckOutLatitude { get; set; }
        public double? CheckOutLongitude { get; set; }
        public string? CheckOutLocationName { get; set; }
        
        public double WorkingHours { get; set; }
        public bool IsLate { get; set; }
        public bool IsEarlyLeave { get; set; }
        
        // Let's use string or int for status to avoid creating a new enum file right now,
        // Actually I should just use int for simplicity or create the Enum.
        // Let's use an int: 0 = Absent, 1 = Present, 2 = HalfDay
        public int Status { get; set; } = 0; 
        
        public string? Notes { get; set; }
    }
}
