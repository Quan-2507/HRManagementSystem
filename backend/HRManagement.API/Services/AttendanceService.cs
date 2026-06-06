using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Attendance;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IAttendanceService
    {
        Task<List<AttendanceDto>> GetTodayAttendanceAsync();
        Task<AttendanceDto> CheckInAsync(Guid employeeId, CheckInDto dto);
        Task<AttendanceDto> CheckOutAsync(Guid employeeId, CheckInDto dto);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly HRManagementDbContext _context;

        public AttendanceService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceDto>> GetTodayAttendanceAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Attendances
                .Include(a => a.Employee)
                .Where(a => a.Date == today)
                .Select(a => new AttendanceDto
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    EmployeeName = a.Employee!.FullName,
                    Date = a.Date,
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime,
                    CheckInLocationName = a.CheckInLocationName,
                    CheckOutLocationName = a.CheckOutLocationName,
                    Notes = a.Notes
                })
                .ToListAsync();
        }

        private const double CompanyLat = 21.0285;
        private const double CompanyLon = 105.8542;
        private const double MaxDistanceKm = 0.5; // 500m

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var r = 6371; // Bán kính Trái đất (km)
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return r * c;
        }

        private double ToRadians(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        private void ValidateLocation(double? lat, double? lon)
        {
            if (lat == null || lon == null)
                throw new Exception("Không lấy được tọa độ GPS.");
                
            var distance = CalculateDistance(CompanyLat, CompanyLon, lat.Value, lon.Value);
            if (distance > MaxDistanceKm)
            {
                throw new Exception($"Vị trí của bạn nằm ngoài bán kính cho phép. Khoảng cách hiện tại: {Math.Round(distance * 1000)}m (Yêu cầu <= 500m).");
            }
        }

        public async Task<AttendanceDto> CheckInAsync(Guid employeeId, CheckInDto dto)
        {
            ValidateLocation(dto.Latitude, dto.Longitude);

            var today = DateTime.UtcNow.Date;
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance != null && attendance.CheckInTime != null)
            {
                throw new Exception("Bạn đã chấm công vào hôm nay rồi.");
            }

            if (attendance == null)
            {
                attendance = new Attendance
                {
                    EmployeeId = employeeId,
                    Date = today,
                    CheckInTime = DateTime.UtcNow,
                    CheckInLatitude = dto.Latitude,
                    CheckInLongitude = dto.Longitude,
                    CheckInLocationName = dto.LocationName
                };
                _context.Attendances.Add(attendance);
            }
            else
            {
                attendance.CheckInTime = DateTime.UtcNow;
                attendance.CheckInLatitude = dto.Latitude;
                attendance.CheckInLongitude = dto.Longitude;
                attendance.CheckInLocationName = dto.LocationName;
            }

            // Check if late (after 08:30 AM)
            // Need to convert Utc to Local time for calculation, let's assume UTC+7
            var localTime = attendance.CheckInTime.Value.AddHours(7);
            if (localTime.TimeOfDay > new TimeSpan(8, 30, 0))
            {
                attendance.IsLate = true;
            }

            await _context.SaveChangesAsync();

            var emp = await _context.Users.FindAsync(employeeId);
            return new AttendanceDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = emp?.FullName ?? "",
                Date = attendance.Date,
                CheckInTime = attendance.CheckInTime,
                CheckInLocationName = attendance.CheckInLocationName
            };
        }

        public async Task<AttendanceDto> CheckOutAsync(Guid employeeId, CheckInDto dto)
        {
            ValidateLocation(dto.Latitude, dto.Longitude);

            var today = DateTime.UtcNow.Date;
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance == null || attendance.CheckInTime == null)
            {
                throw new Exception("Bạn chưa chấm công vào, không thể chấm công ra.");
            }

            if (attendance.CheckOutTime != null)
            {
                throw new Exception("Bạn đã chấm công ra hôm nay rồi.");
            }

            attendance.CheckOutTime = DateTime.UtcNow;
            attendance.CheckOutLatitude = dto.Latitude;
            attendance.CheckOutLongitude = dto.Longitude;
            attendance.CheckOutLocationName = dto.LocationName;

            // Calculate early leave (before 17:30 PM)
            var localOutTime = attendance.CheckOutTime.Value.AddHours(7);
            if (localOutTime.TimeOfDay < new TimeSpan(17, 30, 0))
            {
                attendance.IsEarlyLeave = true;
            }

            // Calculate working hours
            var totalHours = (attendance.CheckOutTime.Value - attendance.CheckInTime.Value).TotalHours;
            // Subtract 1 hour for lunch if working hours > 4
            var workingHours = totalHours > 4 ? totalHours - 1 : totalHours;
            attendance.WorkingHours = Math.Max(0, Math.Round(workingHours, 2));

            // Status: 1 = Present, 2 = HalfDay, 0 = Absent
            attendance.Status = attendance.WorkingHours >= 7 ? 1 : (attendance.WorkingHours >= 3.5 ? 2 : 0);

            await _context.SaveChangesAsync();

            var emp = await _context.Users.FindAsync(employeeId);
            return new AttendanceDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = emp?.FullName ?? "",
                Date = attendance.Date,
                CheckInTime = attendance.CheckInTime,
                CheckOutTime = attendance.CheckOutTime,
                CheckInLocationName = attendance.CheckInLocationName,
                CheckOutLocationName = attendance.CheckOutLocationName
            };
        }
    }
}
