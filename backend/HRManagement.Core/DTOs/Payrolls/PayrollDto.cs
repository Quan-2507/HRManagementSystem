using System;
using System.ComponentModel.DataAnnotations;
using HRManagement.Core.Enums;

namespace HRManagement.Core.DTOs.Payrolls
{
    public class PayrollDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
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
        public PayrollStatus Status { get; set; }
    }

    public class PayrollGenerateDto
    {
        [Required]
        public int Month { get; set; }
        
        [Required]
        public int Year { get; set; }
    }

    public class PayrollUpdateDto
    {
        public decimal TravelAllowance { get; set; }
        public decimal PhoneAllowance { get; set; }
        public decimal UniformAllowance { get; set; }
        public decimal HousingAllowance { get; set; }
        public decimal MealAllowance { get; set; }
        public decimal ResponsibilityAllowance { get; set; }
        public decimal Deductions { get; set; }
    }
}
