using System;
using System.ComponentModel.DataAnnotations;

namespace HRManagement.Core.DTOs.Candidates
{
    public class CandidateDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string AppliedPosition { get; set; } = string.Empty;
        public DateTime ApplicationDate { get; set; }
        public int Status { get; set; }
        public bool IsOnboarded { get; set; }
        public string? Notes { get; set; }
    }

    public class CandidateCreateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        [Required]
        public string AppliedPosition { get; set; } = string.Empty;
    }

    public class CandidateUpdateStatusDto
    {
        public int Status { get; set; }
        public string? Notes { get; set; }
    }
}
