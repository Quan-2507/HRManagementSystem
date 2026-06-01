using System;
using System.Collections.Generic;

namespace HRManagement.Core.Entities
{
    public class Position
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public decimal BaseSalary { get; set; }

        public ICollection<ApplicationUser> Employees { get; set; } = new List<ApplicationUser>();
    }
}
