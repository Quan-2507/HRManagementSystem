using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Common;
using HRManagement.Core.DTOs.Employees;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace HRManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<PagedResult<EmployeeListDto>> GetEmployeesAsync(string? searchTerm, int pageNumber, int pageSize);
        Task<EmployeeDetailDto?> GetEmployeeDetailAsync(Guid id);
        Task<EmployeeDetailDto> CreateEmployeeAsync(EmployeeCreateDto dto);
        Task<bool> UpdateEmployeeAsync(Guid id, EmployeeUpdateDto dto);
        Task<bool> DeleteEmployeeAsync(Guid id);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly HRManagementDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public EmployeeService(HRManagementDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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
                PositionTitle = user.Position?.Title,
                PersonalEmail = user.PersonalEmail,
                AvatarUrl = user.AvatarUrl,
                Gender = user.Gender,
                MaritalStatus = user.MaritalStatus,
                EmergencyContact = user.EmergencyContact,
                IdentityIssueDate = user.IdentityIssueDate,
                IdentityIssuePlace = user.IdentityIssuePlace
            };
        }

        public async Task<EmployeeDetailDto> CreateEmployeeAsync(EmployeeCreateDto dto)
        {
            var user = new ApplicationUser
            {
                Code = dto.Code,
                FullName = dto.FullName,
                Email = dto.Email,
                UserName = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Status = (HRManagement.Core.Enums.EmployeeStatus)1, // Active
                JoinDate = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, "Welcome@123");
            if (!result.Succeeded)
            {
                throw new Exception("Lỗi khi tạo nhân viên: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return new EmployeeDetailDto
            {
                Id = user.Id,
                Code = user.Code,
                FullName = user.FullName,
                Email = user.Email,
                Status = user.Status
            };
        }

        public async Task<bool> UpdateEmployeeAsync(Guid id, EmployeeUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return false;

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.DepartmentId = dto.DepartmentId;
            user.PositionId = dto.PositionId;
            user.Address = dto.Address;
            // Map new fields
            user.PersonalEmail = dto.PersonalEmail;
            user.Gender = dto.Gender;
            user.MaritalStatus = dto.MaritalStatus;
            user.EmergencyContact = dto.EmergencyContact;
            user.IdentityNumber = dto.IdentityNumber;
            user.IdentityIssueDate = dto.IdentityIssueDate;
            user.IdentityIssuePlace = dto.IdentityIssuePlace;
            user.TaxCode = dto.TaxCode;
            user.BankAccount = dto.BankAccount;
            user.BankName = dto.BankName;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> DeleteEmployeeAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return false;

            // Soft delete by setting status to Inactive (0)
            user.Status = (HRManagement.Core.Enums.EmployeeStatus)0; 
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}
