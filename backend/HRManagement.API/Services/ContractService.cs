using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Contracts;
using HRManagement.Core.Entities;
using HRManagement.Core.Enums;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IContractService
    {
        Task<List<ContractDto>> GetAllAsync();
        Task<ContractDto> CreateAsync(ContractCreateDto dto);
        Task<bool> TerminateAsync(Guid id);
    }

    public class ContractService : IContractService
    {
        private readonly HRManagementDbContext _context;

        public ContractService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<ContractDto>> GetAllAsync()
        {
            return await _context.Contracts
                .Include(c => c.Employee)
                .OrderByDescending(c => c.StartDate)
                .Select(c => new ContractDto
                {
                    Id = c.Id,
                    EmployeeId = c.EmployeeId,
                    EmployeeName = c.Employee!.FullName,
                    ContractNumber = c.ContractNumber,
                    Type = c.Type,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    BasicSalary = c.BasicSalary,
                    Status = c.Status
                })
                .ToListAsync();
        }

        public async Task<ContractDto> CreateAsync(ContractCreateDto dto)
        {
            // Terminate existing active contract for this employee
            var activeContracts = await _context.Contracts
                .Where(c => c.EmployeeId == dto.EmployeeId && c.Status == ContractStatus.Active)
                .ToListAsync();

            foreach(var ac in activeContracts)
            {
                ac.Status = ContractStatus.Terminated;
                ac.EndDate = DateTime.UtcNow;
            }

            var contract = new Contract
            {
                EmployeeId = dto.EmployeeId,
                ContractNumber = dto.ContractNumber,
                Type = dto.Type,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                BasicSalary = dto.BasicSalary,
                Status = ContractStatus.Active
            };

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            var emp = await _context.Users.FindAsync(dto.EmployeeId);

            return new ContractDto
            {
                Id = contract.Id,
                EmployeeId = contract.EmployeeId,
                EmployeeName = emp?.FullName ?? "",
                ContractNumber = contract.ContractNumber,
                Type = contract.Type,
                StartDate = contract.StartDate,
                EndDate = contract.EndDate,
                BasicSalary = contract.BasicSalary,
                Status = contract.Status
            };
        }

        public async Task<bool> TerminateAsync(Guid id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return false;

            contract.Status = ContractStatus.Terminated;
            if (contract.EndDate == null || contract.EndDate > DateTime.UtcNow)
            {
                contract.EndDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
