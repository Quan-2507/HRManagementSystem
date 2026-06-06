using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.LeaveRequests;
using HRManagement.Core.Entities;
using HRManagement.Core.Enums;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface ILeaveRequestService
    {
        Task<List<LeaveRequestDto>> GetAllRequestsAsync();
        Task<List<LeaveRequestDto>> GetMyRequestsAsync(Guid employeeId);
        Task<LeaveRequestDto> SubmitRequestAsync(Guid employeeId, LeaveRequestCreateDto dto);
        Task<bool> ApproveRequestAsync(Guid id, Guid approverId, LeaveRequestApproveDto dto);
    }

    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly HRManagementDbContext _context;

        public LeaveRequestService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<LeaveRequestDto>> GetAllRequestsAsync()
        {
            return await _context.LeaveRequests
                .Include(r => r.Employee)
                .Include(r => r.Approver)
                .OrderByDescending(r => r.StartDate)
                .Select(r => new LeaveRequestDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee!.FullName,
                    LeaveType = r.LeaveType,
                    StartDate = r.StartDate,
                    EndDate = r.EndDate,
                    Reason = r.Reason,
                    Status = r.Status,
                    ApproverId = r.ApproverId,
                    ApproverName = r.Approver != null ? r.Approver.FullName : null,
                    RejectReason = r.RejectReason
                })
                .ToListAsync();
        }

        public async Task<List<LeaveRequestDto>> GetMyRequestsAsync(Guid employeeId)
        {
            return await _context.LeaveRequests
                .Include(r => r.Employee)
                .Include(r => r.Approver)
                .Where(r => r.EmployeeId == employeeId)
                .OrderByDescending(r => r.StartDate)
                .Select(r => new LeaveRequestDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee!.FullName,
                    LeaveType = r.LeaveType,
                    StartDate = r.StartDate,
                    EndDate = r.EndDate,
                    Reason = r.Reason,
                    Status = r.Status,
                    ApproverId = r.ApproverId,
                    ApproverName = r.Approver != null ? r.Approver.FullName : null,
                    RejectReason = r.RejectReason
                })
                .ToListAsync();
        }

        public async Task<LeaveRequestDto> SubmitRequestAsync(Guid employeeId, LeaveRequestCreateDto dto)
        {
            if (dto.StartDate > dto.EndDate)
            {
                throw new Exception("Ngày bắt đầu không thể sau ngày kết thúc.");
            }

            var request = new LeaveRequest
            {
                EmployeeId = employeeId,
                LeaveType = dto.LeaveType,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Reason = dto.Reason,
                Status = LeaveStatus.Pending
            };

            _context.LeaveRequests.Add(request);
            await _context.SaveChangesAsync();

            var emp = await _context.Users.FindAsync(employeeId);

            return new LeaveRequestDto
            {
                Id = request.Id,
                EmployeeId = request.EmployeeId,
                EmployeeName = emp?.FullName ?? "",
                LeaveType = request.LeaveType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Reason = request.Reason,
                Status = request.Status
            };
        }

        public async Task<bool> ApproveRequestAsync(Guid id, Guid approverId, LeaveRequestApproveDto dto)
        {
            var request = await _context.LeaveRequests.FindAsync(id);
            if (request == null) return false;

            if (request.Status != LeaveStatus.Pending)
            {
                throw new Exception("Đơn này đã được duyệt hoặc từ chối.");
            }

            request.Status = dto.Status;
            request.ApproverId = approverId;
            if (dto.Status == HRManagement.Core.Enums.LeaveStatus.Rejected)
            {
                request.RejectReason = dto.RejectReason;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
