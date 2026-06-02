using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Departments;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IDepartmentService
    {
        Task<List<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto> CreateAsync(DepartmentCreateDto dto);
        Task<bool> UpdateAsync(Guid id, DepartmentCreateDto dto);
        Task<bool> DeleteAsync(Guid id);
    }

    public class DepartmentService : IDepartmentService
    {
        private readonly HRManagementDbContext _context;

        public DepartmentService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepartmentDto>> GetAllAsync()
        {
            return await _context.Departments
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    EmployeeCount = _context.Users.Count(u => u.DepartmentId == d.Id)
                })
                .ToListAsync();
        }

        public async Task<DepartmentDto> CreateAsync(DepartmentCreateDto dto)
        {
            var dept = new Department
            {
                Name = dto.Name,
                Description = dto.Description
            };
            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();
            return new DepartmentDto { Id = dept.Id, Name = dept.Name, Description = dept.Description, EmployeeCount = 0 };
        }

        public async Task<bool> UpdateAsync(Guid id, DepartmentCreateDto dto)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;
            dept.Name = dto.Name;
            dept.Description = dto.Description;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;
            
            // Check if employees belong to it
            var hasEmployees = await _context.Users.AnyAsync(u => u.DepartmentId == id);
            if (hasEmployees) throw new Exception("Không thể xóa phòng ban đang có nhân viên.");

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
