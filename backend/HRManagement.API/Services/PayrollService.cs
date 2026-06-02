using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRManagement.Core.DTOs.Payrolls;
using HRManagement.Core.Entities;
using HRManagement.Core.Enums;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Services
{
    public interface IPayrollService
    {
        Task<List<PayrollDto>> GetByMonthYearAsync(int month, int year);
        Task<int> GeneratePayrollAsync(int month, int year);
        Task<PayrollDto> UpdatePayrollAsync(Guid id, PayrollUpdateDto dto);
    }

    public class PayrollService : IPayrollService
    {
        private readonly HRManagementDbContext _context;

        public PayrollService(HRManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<PayrollDto>> GetByMonthYearAsync(int month, int year)
        {
            return await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.Month == month && p.Year == year)
                .Select(p => new PayrollDto
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee!.FullName,
                    Month = p.Month,
                    Year = p.Year,
                    BasicSalary = p.BasicSalary,
                    Allowances = p.Allowances,
                    Deductions = p.Deductions,
                    NetSalary = p.NetSalary,
                    Status = p.Status
                })
                .ToListAsync();
        }

        public async Task<int> GeneratePayrollAsync(int month, int year)
        {
            // Only generate for active employees who have an active contract
            var activeEmployeesWithContracts = await _context.Users
                .Where(u => u.Status == EmployeeStatus.Active)
                .Select(u => new
                {
                    EmployeeId = u.Id,
                    ActiveContract = _context.Contracts.FirstOrDefault(c => c.EmployeeId == u.Id && c.Status == ContractStatus.Active)
                })
                .Where(x => x.ActiveContract != null)
                .ToListAsync();

            int count = 0;

            foreach (var item in activeEmployeesWithContracts)
            {
                // Check if payroll already exists for this month/year
                var existing = await _context.Payrolls
                    .FirstOrDefaultAsync(p => p.EmployeeId == item.EmployeeId && p.Month == month && p.Year == year);

                if (existing == null)
                {
                    decimal baseSalary = item.ActiveContract!.BasicSalary;
                    
                    var payroll = new Payroll
                    {
                        EmployeeId = item.EmployeeId,
                        Month = month,
                        Year = year,
                        BasicSalary = baseSalary,
                        Allowances = 0,
                        Deductions = 0,
                        NetSalary = baseSalary, // base + 0 - 0
                        Status = PayrollStatus.Draft
                    };

                    _context.Payrolls.Add(payroll);
                    count++;
                }
            }

            if (count > 0)
            {
                await _context.SaveChangesAsync();
            }

            return count;
        }

        public async Task<PayrollDto> UpdatePayrollAsync(Guid id, PayrollUpdateDto dto)
        {
            var payroll = await _context.Payrolls
                .Include(p => p.Employee)
                .FirstOrDefaultAsync(p => p.Id == id);
                
            if (payroll == null)
                throw new Exception("Không tìm thấy bảng lương.");

            payroll.Allowances = dto.Allowances;
            payroll.Deductions = dto.Deductions;
            payroll.NetSalary = payroll.BasicSalary + payroll.Allowances - payroll.Deductions;

            await _context.SaveChangesAsync();

            return new PayrollDto
            {
                Id = payroll.Id,
                EmployeeId = payroll.EmployeeId,
                EmployeeName = payroll.Employee!.FullName,
                Month = payroll.Month,
                Year = payroll.Year,
                BasicSalary = payroll.BasicSalary,
                Allowances = payroll.Allowances,
                Deductions = payroll.Deductions,
                NetSalary = payroll.NetSalary,
                Status = payroll.Status
            };
        }
    }
}
