using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Common;
using HRManagement.Core.DTOs.Employees;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<PagedResult<EmployeeListDto>> GetEmployeesAsync(string? searchTerm, int pageNumber, int pageSize);
        Task<EmployeeDetailDto?> GetEmployeeDetailAsync(Guid id);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly HRManagementDbContext _context;

        public EmployeeService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<EmployeeListDto>> GetEmployeesAsync(string? searchTerm, int pageNumber, int pageSize)
        {
            var query = _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u => u.FullName.Contains(searchTerm) || 
                                         u.Code.Contains(searchTerm) || 
                                         (u.Email != null && u.Email.Contains(searchTerm)));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new EmployeeListDto
                {
                    Id = u.Id,
                    Code = u.Code,
                    FullName = u.FullName,
                    Email = u.Email,
                    DepartmentName = u.Department != null ? u.Department.Name : null,
                    PositionTitle = u.Position != null ? u.Position.Title : null,
                    Status = u.Status
                })
                .ToListAsync();

            return new PagedResult<EmployeeListDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<EmployeeDetailDto?> GetEmployeeDetailAsync(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return null;

            return new EmployeeDetailDto
            {
                Id = user.Id,
                Code = user.Code,
                FullName = user.FullName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                JoinDate = user.JoinDate,
                Address = user.Address,
                IdentityNumber = user.IdentityNumber,
                TaxCode = user.TaxCode,
                BankAccount = user.BankAccount,
                BankName = user.BankName,
                Status = user.Status,
                DepartmentName = user.Department?.Name,
                PositionTitle = user.Position?.Title
            };
        }
    }
}
