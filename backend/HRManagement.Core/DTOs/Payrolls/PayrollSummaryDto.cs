using System;
using System.Collections.Generic;

namespace HRManagement.Core.DTOs.Payrolls
{
    public class PayrollSummaryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsExpanded { get; set; } = true;
        public int Level { get; set; }
        
        public int Headcount { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal TravelAllow { get; set; }
        public decimal PhoneAllow { get; set; }
        public decimal UniformAllow { get; set; }
        public decimal HousingAllow { get; set; }
        public decimal MealAllow { get; set; }
        public decimal RespAllow { get; set; }
        
        public List<PayrollSummaryDto> Children { get; set; } = new List<PayrollSummaryDto>();
    }
}
