using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Candidates;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace HRManagement.API.Services
{
    public interface ICandidateService
    {
        Task<List<CandidateDto>> GetAllAsync();
        Task<CandidateDto> CreateAsync(CandidateCreateDto dto);
        Task<CandidateDto> UpdateStatusAsync(Guid id, CandidateUpdateStatusDto dto);
        Task<CandidateDto> OnboardAsync(Guid id);
    }

    public class CandidateService : ICandidateService
    {
        private readonly HRManagementDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CandidateService(HRManagementDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<CandidateDto>> GetAllAsync()
        {
            return await _context.Candidates
                .OrderByDescending(c => c.ApplicationDate)
                .Select(c => new CandidateDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber,
                    AppliedPosition = c.AppliedPosition,
                    ApplicationDate = c.ApplicationDate,
                    Status = c.Status,
                    IsOnboarded = c.IsOnboarded,
                    Notes = c.Notes
                })
                .ToListAsync();
        }

        public async Task<CandidateDto> CreateAsync(CandidateCreateDto dto)
        {
            var candidate = new Candidate
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                AppliedPosition = dto.AppliedPosition,
                Status = 1 // Mới
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            return new CandidateDto
            {
                Id = candidate.Id,
                FullName = candidate.FullName,
                Email = candidate.Email,
                PhoneNumber = candidate.PhoneNumber,
                AppliedPosition = candidate.AppliedPosition,
                ApplicationDate = candidate.ApplicationDate,
                Status = candidate.Status,
                IsOnboarded = candidate.IsOnboarded
            };
        }

        public async Task<CandidateDto> UpdateStatusAsync(Guid id, CandidateUpdateStatusDto dto)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null) throw new Exception("Không tìm thấy ứng viên.");

            candidate.Status = dto.Status;
            if (dto.Notes != null) candidate.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return new CandidateDto
            {
                Id = candidate.Id,
                FullName = candidate.FullName,
                Email = candidate.Email,
                PhoneNumber = candidate.PhoneNumber,
                AppliedPosition = candidate.AppliedPosition,
                ApplicationDate = candidate.ApplicationDate,
                Status = candidate.Status,
                IsOnboarded = candidate.IsOnboarded,
                Notes = candidate.Notes
            };
        }

        public async Task<CandidateDto> OnboardAsync(Guid id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null) throw new Exception("Không tìm thấy ứng viên.");

            if (candidate.Status != 3) // 3 = Pass
                throw new Exception("Ứng viên chưa Pass phỏng vấn.");

            if (candidate.IsOnboarded)
                throw new Exception("Ứng viên này đã được onboard.");

            // Create ApplicationUser
            var existingUser = await _userManager.FindByEmailAsync(candidate.Email);
            if (existingUser != null)
                throw new Exception("Email này đã được sử dụng bởi một nhân viên khác.");

            var newUser = new ApplicationUser
            {
                UserName = candidate.Email,
                Email = candidate.Email,
                FullName = candidate.FullName,
                PhoneNumber = candidate.PhoneNumber,
                Status = HRManagement.Core.Enums.EmployeeStatus.Active,
                JoinDate = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(newUser, "hr123456!"); // Default password

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Không thể tạo tài khoản nhân viên: {errors}");
            }

            candidate.IsOnboarded = true;
            candidate.OnboardedEmployeeId = newUser.Id;

            await _context.SaveChangesAsync();

            return new CandidateDto
            {
                Id = candidate.Id,
                FullName = candidate.FullName,
                Email = candidate.Email,
                PhoneNumber = candidate.PhoneNumber,
                AppliedPosition = candidate.AppliedPosition,
                ApplicationDate = candidate.ApplicationDate,
                Status = candidate.Status,
                IsOnboarded = candidate.IsOnboarded,
                Notes = candidate.Notes
            };
        }
    }
}
