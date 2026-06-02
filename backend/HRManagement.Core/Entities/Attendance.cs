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
        
        public string? Notes { get; set; }
    }
}
