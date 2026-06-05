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
        Task<List<PayrollSummaryDto>> GetPayrollSummaryTreeAsync(int month, int year);
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
                    TravelAllowance = p.TravelAllowance,
                    PhoneAllowance = p.PhoneAllowance,
                    UniformAllowance = p.UniformAllowance,
                    HousingAllowance = p.HousingAllowance,
                    MealAllowance = p.MealAllowance,
                    ResponsibilityAllowance = p.ResponsibilityAllowance,
                    Deductions = p.Deductions,
                    NetSalary = p.NetSalary,
                    Status = p.Status
                })
                .ToListAsync();
        }

        public async Task<List<PayrollSummaryDto>> GetPayrollSummaryTreeAsync(int month, int year)
        {
            // 1. Fetch all payrolls for the given month & year
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Where(p => p.Month == month && p.Year == year)
                .ToListAsync();

            // 2. Fetch all departments
            var departments = await _context.Departments.ToListAsync();

            // 3. Build lookup from DepartmentId to List of Payrolls
            var payrollDict = payrolls
                .Where(p => p.Employee != null && p.Employee.DepartmentId.HasValue)
                .GroupBy(p => p.Employee!.DepartmentId!.Value)
                .ToDictionary(g => g.Key, g => g.ToList());

            // 4. Recursive function to build tree
            PayrollSummaryDto BuildNode(Department dept, int level)
            {
                var node = new PayrollSummaryDto
                {
                    Id = dept.Id.ToString(),
                    Name = dept.Name,
                    Level = level,
                    IsExpanded = level < 2
                };

                // Add direct employee payrolls
                if (payrollDict.TryGetValue(dept.Id, out var deptPayrolls))
                {
                    node.Headcount += deptPayrolls.Count;
                    node.BasicSalary += deptPayrolls.Sum(p => p.BasicSalary);
                    node.TravelAllow += deptPayrolls.Sum(p => p.TravelAllowance);
                    node.PhoneAllow += deptPayrolls.Sum(p => p.PhoneAllowance);
                    node.UniformAllow += deptPayrolls.Sum(p => p.UniformAllowance);
                    node.HousingAllow += deptPayrolls.Sum(p => p.HousingAllowance);
                    node.MealAllow += deptPayrolls.Sum(p => p.MealAllowance);
                    node.RespAllow += deptPayrolls.Sum(p => p.ResponsibilityAllowance);
                }

                // Recursively process sub-departments
                var subDepts = departments.Where(d => d.ParentDepartmentId == dept.Id).ToList();
                foreach (var subDept in subDepts)
                {
                    var childNode = BuildNode(subDept, level + 1);
                    
                    // Only add child if it has headcount > 0 or it's part of the structure
                    if (childNode.Headcount > 0 || childNode.Children.Any())
                    {
                        node.Children.Add(childNode);
                        
                        // Rollup totals
                        node.Headcount += childNode.Headcount;
                        node.BasicSalary += childNode.BasicSalary;
                        node.TravelAllow += childNode.TravelAllow;
                        node.PhoneAllow += childNode.PhoneAllow;
                        node.UniformAllow += childNode.UniformAllow;
                        node.HousingAllow += childNode.HousingAllow;
                        node.MealAllow += childNode.MealAllow;
                        node.RespAllow += childNode.RespAllow;
                    }
                }

                return node;
            }

            // 5. Get root departments (ParentDepartmentId == null)
            var rootDepartments = departments.Where(d => d.ParentDepartmentId == null).ToList();
            
            var result = new List<PayrollSummaryDto>();
            foreach (var root in rootDepartments)
            {
                var rootNode = BuildNode(root, 0);
                if (rootNode.Headcount > 0 || rootNode.Children.Any())
                {
                    result.Add(rootNode);
                }
            }

            // If empty (no departments), let's just create a dummy root for all floating payrolls
            if (!result.Any() && payrolls.Any())
            {
                var dummyRoot = new PayrollSummaryDto
                {
                    Id = "root",
                    Name = "Tổng Công Ty",
                    Level = 0,
                    Headcount = payrolls.Count,
                    BasicSalary = payrolls.Sum(p => p.BasicSalary),
                    TravelAllow = payrolls.Sum(p => p.TravelAllowance),
                    PhoneAllow = payrolls.Sum(p => p.PhoneAllowance),
                    UniformAllow = payrolls.Sum(p => p.UniformAllowance),
                    HousingAllow = payrolls.Sum(p => p.HousingAllowance),
                    MealAllow = payrolls.Sum(p => p.MealAllowance),
                    RespAllow = payrolls.Sum(p => p.ResponsibilityAllowance)
                };
                result.Add(dummyRoot);
            }

            return result;
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
                        TravelAllowance = 0,
                        PhoneAllowance = 0,
                        UniformAllowance = 0,
                        HousingAllowance = 0,
                        MealAllowance = 0,
                        ResponsibilityAllowance = 0,
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

            payroll.TravelAllowance = dto.TravelAllowance;
            payroll.PhoneAllowance = dto.PhoneAllowance;
            payroll.UniformAllowance = dto.UniformAllowance;
            payroll.HousingAllowance = dto.HousingAllowance;
            payroll.MealAllowance = dto.MealAllowance;
            payroll.ResponsibilityAllowance = dto.ResponsibilityAllowance;
            payroll.Deductions = dto.Deductions;
            payroll.NetSalary = payroll.BasicSalary + payroll.TravelAllowance + payroll.PhoneAllowance + payroll.UniformAllowance + payroll.HousingAllowance + payroll.MealAllowance + payroll.ResponsibilityAllowance - payroll.Deductions;

            await _context.SaveChangesAsync();

            return new PayrollDto
            {
                Id = payroll.Id,
                EmployeeId = payroll.EmployeeId,
                EmployeeName = payroll.Employee!.FullName,
                Month = payroll.Month,
                Year = payroll.Year,
                BasicSalary = payroll.BasicSalary,
                TravelAllowance = payroll.TravelAllowance,
                PhoneAllowance = payroll.PhoneAllowance,
                UniformAllowance = payroll.UniformAllowance,
                HousingAllowance = payroll.HousingAllowance,
                MealAllowance = payroll.MealAllowance,
                ResponsibilityAllowance = payroll.ResponsibilityAllowance,
                Deductions = payroll.Deductions,
                NetSalary = payroll.NetSalary,
                Status = payroll.Status
            };
        }
    }
}
