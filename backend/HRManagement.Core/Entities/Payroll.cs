using System;
using HRManagement.Core.Enums;

namespace HRManagement.Core.Entities
{
    public class Payroll
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid EmployeeId { get; set; }
        public ApplicationUser? Employee { get; set; }

        public int Month { get; set; }
        public int Year { get; set; }
        
        public decimal BasicSalary { get; set; }
        
        public decimal TravelAllowance { get; set; }
        public decimal PhoneAllowance { get; set; }
        public decimal UniformAllowance { get; set; }
        public decimal HousingAllowance { get; set; }
        public decimal MealAllowance { get; set; }
        public decimal ResponsibilityAllowance { get; set; }
        
        public decimal Deductions { get; set; }
        
        public decimal NetSalary { get; set; }
        
        public PayrollStatus Status { get; set; } = PayrollStatus.Draft;
    }
}
