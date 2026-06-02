using System;
using System.ComponentModel.DataAnnotations;
using HRManagement.Core.Enums;

namespace HRManagement.Core.DTOs.Contracts
{
    public class ContractDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string ContractNumber { get; set; } = string.Empty;
        public ContractType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal BasicSalary { get; set; }
        public ContractStatus Status { get; set; }
    }

    public class ContractCreateDto
    {
        [Required]
        public Guid EmployeeId { get; set; }
        
        [Required]
        public string ContractNumber { get; set; } = string.Empty;
        
        [Required]
        public ContractType Type { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        [Required]
        public decimal BasicSalary { get; set; }
    }
}
