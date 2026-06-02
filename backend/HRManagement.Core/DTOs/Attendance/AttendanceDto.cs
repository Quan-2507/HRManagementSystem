using System;
using System.ComponentModel.DataAnnotations;

namespace HRManagement.Core.DTOs.Attendance
{
    public class AttendanceDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? CheckInLocationName { get; set; }
        public string? CheckOutLocationName { get; set; }
        public string? Notes { get; set; }
    }

    public class CheckInDto
    {
        [Required]
        public double Latitude { get; set; }
        
        [Required]
        public double Longitude { get; set; }
        
        public string? LocationName { get; set; }
    }
}
