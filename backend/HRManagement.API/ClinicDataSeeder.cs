using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using HRManagement.Core.Entities;
using HRManagement.Infrastructure.Data;

namespace HRManagement.API.Data
{
    public static class ClinicDataSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<HRManagementDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            if (!context.Departments.Any())
            {
                var newDepts = new[]
                {
                    new Department { Id = Guid.NewGuid(), Name = "Khoa Nội", Description = "Khám và điều trị nội khoa" },
                    new Department { Id = Guid.NewGuid(), Name = "Khoa Ngoại", Description = "Phẫu thuật và ngoại khoa" },
                    new Department { Id = Guid.NewGuid(), Name = "Khoa Nhi", Description = "Khám và điều trị nhi khoa" },
                    new Department { Id = Guid.NewGuid(), Name = "Khoa Cấp cứu", Description = "Trực cấp cứu 24/7" },
                    new Department { Id = Guid.NewGuid(), Name = "Khoa Phụ sản", Description = "Khám thai và phụ khoa" },
                    new Department { Id = Guid.NewGuid(), Name = "Phòng Hành chính - Kế toán", Description = "Hành chính kế toán" },
                    new Department { Id = Guid.NewGuid(), Name = "Quầy Lễ tân", Description = "Tiếp đón bệnh nhân" }
                };
                context.Departments.AddRange(newDepts);
                await context.SaveChangesAsync();
            }

            if (!context.Positions.Any())
            {
                var newPositions = new[]
                {
                    new Position { Id = Guid.NewGuid(), Title = "Trưởng khoa", BaseSalary = 25000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Bác sĩ chuyên khoa I", BaseSalary = 20000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Bác sĩ đa khoa", BaseSalary = 18000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Điều dưỡng trưởng", BaseSalary = 12000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Điều dưỡng viên", BaseSalary = 9000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Lễ tân", BaseSalary = 7000000 },
                    new Position { Id = Guid.NewGuid(), Title = "Kế toán viên", BaseSalary = 10000000 }
                };
                context.Positions.AddRange(newPositions);
                await context.SaveChangesAsync();
            }

            var depts = context.Departments.ToList();
            var positions = context.Positions.ToList();

            var employees = new[]
            {
                new { Email = "bs.minh@hrmanagement.com", Name = "Nguyễn Văn Minh", Code = "EMP001", Dept = "Khoa Nội", Pos = "Trưởng khoa" },
                new { Email = "bs.lan@hrmanagement.com", Name = "Trần Thị Lan", Code = "EMP002", Dept = "Khoa Nội", Pos = "Bác sĩ chuyên khoa I" },
                new { Email = "dd.hoa@hrmanagement.com", Name = "Lê Thị Hoa", Code = "EMP003", Dept = "Khoa Nội", Pos = "Điều dưỡng trưởng" },
                new { Email = "bs.tu@hrmanagement.com", Name = "Phạm Hoàng Tú", Code = "EMP004", Dept = "Khoa Ngoại", Pos = "Trưởng khoa" },
                new { Email = "bs.nam@hrmanagement.com", Name = "Bùi Văn Nam", Code = "EMP005", Dept = "Khoa Ngoại", Pos = "Bác sĩ đa khoa" },
                new { Email = "dd.mai@hrmanagement.com", Name = "Hoàng Thị Mai", Code = "EMP006", Dept = "Khoa Ngoại", Pos = "Điều dưỡng viên" },
                new { Email = "bs.hang@hrmanagement.com", Name = "Vũ Thu Hằng", Code = "EMP007", Dept = "Khoa Nhi", Pos = "Trưởng khoa" },
                new { Email = "bs.an@hrmanagement.com", Name = "Đặng Bình An", Code = "EMP008", Dept = "Khoa Nhi", Pos = "Bác sĩ chuyên khoa I" },
                new { Email = "dd.cuc@hrmanagement.com", Name = "Ngô Kim Cúc", Code = "EMP009", Dept = "Khoa Nhi", Pos = "Điều dưỡng viên" },
                new { Email = "bs.long@hrmanagement.com", Name = "Đinh Thành Long", Code = "EMP010", Dept = "Khoa Cấp cứu", Pos = "Trưởng khoa" },
                new { Email = "dd.thao@hrmanagement.com", Name = "Đỗ Phương Thảo", Code = "EMP011", Dept = "Khoa Cấp cứu", Pos = "Điều dưỡng viên" },
                new { Email = "bs.huong@hrmanagement.com", Name = "Lý Lan Hương", Code = "EMP012", Dept = "Khoa Phụ sản", Pos = "Bác sĩ chuyên khoa I" },
                new { Email = "kt.dung@hrmanagement.com", Name = "Hồ Trọng Dũng", Code = "EMP013", Dept = "Phòng Hành chính - Kế toán", Pos = "Kế toán viên" },
                new { Email = "lt.trang@hrmanagement.com", Name = "Phan Thùy Trang", Code = "EMP014", Dept = "Quầy Lễ tân", Pos = "Lễ tân" },
                new { Email = "lt.quyen@hrmanagement.com", Name = "Trương Tú Quyên", Code = "EMP015", Dept = "Quầy Lễ tân", Pos = "Lễ tân" }
            };

            foreach (var emp in employees)
            {
                var existingUser = await userManager.FindByEmailAsync(emp.Email);
                if (existingUser == null)
                {
                    var user = new ApplicationUser
                    {
                        UserName = emp.Email,
                        Email = emp.Email,
                        FullName = emp.Name,
                        Code = emp.Code,
                        DepartmentId = depts.First(d => d.Name == emp.Dept).Id,
                        PositionId = positions.First(p => p.Title == emp.Pos).Id,
                        Status = HRManagement.Core.Enums.EmployeeStatus.Active,
                        JoinDate = DateTime.UtcNow.AddMonths(new Random().Next(-60, -1))
                    };
                    await userManager.CreateAsync(user, "Password123");
                }
            }

            var allEmployees = userManager.Users.ToList();
            var random = new Random();
            
            if (!context.Contracts.Any())
            {
                var contracts = allEmployees.Select(e => new Contract
                {
                    EmployeeId = e.Id,
                    ContractNumber = $"HD-{e.Code}",
                    Type = HRManagement.Core.Enums.ContractType.DefiniteTerm,
                    StartDate = e.JoinDate ?? DateTime.UtcNow.AddYears(-1),
                    EndDate = (e.JoinDate ?? DateTime.UtcNow.AddYears(-1)).AddYears(3),
                    BasicSalary = positions.FirstOrDefault(p => p.Id == e.PositionId)?.BaseSalary ?? 15000000,
                    Status = HRManagement.Core.Enums.ContractStatus.Active
                }).ToList();
                context.Contracts.AddRange(contracts);
            }

            if (!context.LeaveRequests.Any())
            {
                var leaves = allEmployees.Take(5).Select(e => new LeaveRequest
                {
                    EmployeeId = e.Id,
                    LeaveType = HRManagement.Core.Enums.LeaveType.AnnualLeave,
                    StartDate = DateTime.UtcNow.AddDays(random.Next(1, 10)),
                    EndDate = DateTime.UtcNow.AddDays(random.Next(11, 15)),
                    Reason = "Nghỉ phép thường niên",
                    Status = HRManagement.Core.Enums.LeaveStatus.Approved
                }).ToList();
                context.LeaveRequests.AddRange(leaves);
            }

            if (!context.Payrolls.Any())
            {
                var payrolls = allEmployees.Select(e => {
                    var baseSalary = positions.FirstOrDefault(p => p.Id == e.PositionId)?.BaseSalary ?? 15000000;
                    return new Payroll
                    {
                        EmployeeId = e.Id,
                        Month = DateTime.UtcNow.Month,
                        Year = DateTime.UtcNow.Year,
                        BasicSalary = 15000000,
                        TravelAllowance = 2000000,
                        ResponsibilityAllowance = 1000000,
                        Deductions = 500000,
                        NetSalary = 17500000,
                        Status = HRManagement.Core.Enums.PayrollStatus.Paid
                    };
                }).ToList();
                context.Payrolls.AddRange(payrolls);
            }

            if (!context.Attendances.Any())
            {
                var attendances = allEmployees.Select(e => new Attendance
                {
                    EmployeeId = e.Id,
                    Date = DateTime.UtcNow.Date,
                    CheckInTime = DateTime.UtcNow.Date.AddHours(7).AddMinutes(random.Next(30, 60)),
                    CheckOutTime = DateTime.UtcNow.Date.AddHours(17).AddMinutes(random.Next(0, 30)),
                    CheckInLocationName = "Bệnh viện đa khoa",
                    CheckOutLocationName = "Bệnh viện đa khoa"
                }).ToList();
                context.Attendances.AddRange(attendances);
            }

            await context.SaveChangesAsync();
        }
    }
}
