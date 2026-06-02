using System;
using HRManagement.Core.Enums;

namespace HRManagement.Core.Entities
{
    public class Contract
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid EmployeeId { get; set; }
        public ApplicationUser? Employee { get; set; }

        public string ContractNumber { get; set; } = string.Empty;
        public ContractType Type { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        public decimal BasicSalary { get; set; }
        
        public ContractStatus Status { get; set; } = ContractStatus.Active;
    }
}
