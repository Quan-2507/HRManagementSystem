using System;
using System.ComponentModel.DataAnnotations;

namespace HRManagement.Core.DTOs.Kpis
{
    public class EmployeeKpiDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public double Score { get; set; }
        public string? ReviewerComment { get; set; }
        public Guid? ReviewerId { get; set; }
        public string? ReviewerName { get; set; }
        public int Status { get; set; }
    }

    public class EmployeeKpiCreateDto
    {
        [Required]
        public Guid EmployeeId { get; set; }
        
        [Required]
        public string Period { get; set; } = string.Empty;

        [Required]
        public double Score { get; set; }
    }
    
    public class EmployeeKpiUpdateDto
    {
        [Required]
        public double Score { get; set; }
        public string? ReviewerComment { get; set; }
        public int Status { get; set; }
    }
}
