using System;
using System.Collections.Generic;

namespace HRManagement.Core.Entities
{
    public class Department
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ManagerId { get; set; }

        public Guid? ParentDepartmentId { get; set; }
        public Department? ParentDepartment { get; set; }
        public ICollection<Department> SubDepartments { get; set; } = new List<Department>();

        public ICollection<ApplicationUser> Employees { get; set; } = new List<ApplicationUser>();
    }
}
