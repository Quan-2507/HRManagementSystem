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

        public async Task<AttendanceDto> CheckInAsync(Guid employeeId, CheckInDto dto)
        {
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
