using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Kpis;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IKpiService
    {
        Task<List<EmployeeKpiDto>> GetAllKpisAsync(string? period);
        Task<List<EmployeeKpiDto>> GetMyKpisAsync(Guid employeeId);
        Task<EmployeeKpiDto> CreateKpiAsync(EmployeeKpiCreateDto dto);
        Task<EmployeeKpiDto> UpdateKpiAsync(Guid id, EmployeeKpiUpdateDto dto);
        Task<bool> DeleteKpiAsync(Guid id);
    }

    public class KpiService : IKpiService
    {
        private readonly HRManagementDbContext _context;

        public KpiService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmployeeKpiDto>> GetAllKpisAsync(string? period)
        {
            var query = _context.EmployeeKpis
                .Include(k => k.Employee)
                .Include(k => k.Reviewer)
                .AsQueryable();

            if (!string.IsNullOrEmpty(period))
            {
                query = query.Where(k => k.Period == period);
            }

            return await query
                .OrderByDescending(k => k.Period)
                .Select(k => new EmployeeKpiDto
                {
                    Id = k.Id,
                    EmployeeId = k.EmployeeId,
                    EmployeeName = k.Employee!.FullName,
                    Period = k.Period,
                    Score = k.Score,
                    ReviewerComment = k.ReviewerComment,
                    ReviewerId = k.ReviewerId,
                    ReviewerName = k.Reviewer != null ? k.Reviewer.FullName : null,
                    Status = k.Status
                })
                .ToListAsync();
        }

        public async Task<List<EmployeeKpiDto>> GetMyKpisAsync(Guid employeeId)
        {
            return await _context.EmployeeKpis
                .Include(k => k.Employee)
                .Include(k => k.Reviewer)
                .Where(k => k.EmployeeId == employeeId)
                .OrderByDescending(k => k.Period)
                .Select(k => new EmployeeKpiDto
                {
                    Id = k.Id,
                    EmployeeId = k.EmployeeId,
                    EmployeeName = k.Employee!.FullName,
                    Period = k.Period,
                    Score = k.Score,
                    ReviewerComment = k.ReviewerComment,
                    ReviewerId = k.ReviewerId,
                    ReviewerName = k.Reviewer != null ? k.Reviewer.FullName : null,
                    Status = k.Status
                })
                .ToListAsync();
        }

        public async Task<EmployeeKpiDto> CreateKpiAsync(EmployeeKpiCreateDto dto)
        {
            var kpi = new EmployeeKpi
            {
                EmployeeId = dto.EmployeeId,
                Period = dto.Period,
                Score = dto.Score,
                Status = 1 // Draft
            };

            _context.EmployeeKpis.Add(kpi);
            await _context.SaveChangesAsync();

            var emp = await _context.Users.FindAsync(dto.EmployeeId);

            return new EmployeeKpiDto
            {
                Id = kpi.Id,
                EmployeeId = kpi.EmployeeId,
                EmployeeName = emp?.FullName ?? "",
                Period = kpi.Period,
                Score = kpi.Score,
                Status = kpi.Status
            };
        }

        public async Task<EmployeeKpiDto> UpdateKpiAsync(Guid id, EmployeeKpiUpdateDto dto)
        {
            var kpi = await _context.EmployeeKpis
                .Include(k => k.Employee)
                .Include(k => k.Reviewer)
                .FirstOrDefaultAsync(k => k.Id == id);

            if (kpi == null) throw new Exception("Không tìm thấy KPI.");

            kpi.Score = dto.Score;
            kpi.ReviewerComment = dto.ReviewerComment;
            kpi.Status = dto.Status;

            await _context.SaveChangesAsync();

            return new EmployeeKpiDto
            {
                Id = kpi.Id,
                EmployeeId = kpi.EmployeeId,
                EmployeeName = kpi.Employee!.FullName,
                Period = kpi.Period,
                Score = kpi.Score,
                ReviewerComment = kpi.ReviewerComment,
                ReviewerId = kpi.ReviewerId,
                ReviewerName = kpi.Reviewer != null ? kpi.Reviewer.FullName : null,
                Status = kpi.Status
            };
        }

        public async Task<bool> DeleteKpiAsync(Guid id)
        {
            var kpi = await _context.EmployeeKpis.FindAsync(id);
            if (kpi == null) return false;

            _context.EmployeeKpis.Remove(kpi);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
