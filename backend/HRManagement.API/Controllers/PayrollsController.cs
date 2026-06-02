using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HRManagement.API.Services;
using HRManagement.Core.DTOs.Payrolls;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PayrollsController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollsController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }

        [HttpGet("{year}/{month}")]
        public async Task<IActionResult> GetByMonthYear(int year, int month)
        {
            var result = await _payrollService.GetByMonthYearAsync(month, year);
            return Ok(result);
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] PayrollGenerateDto dto)
        {
            try
            {
                var count = await _payrollService.GeneratePayrollAsync(dto.Month, dto.Year);
                return Ok(new { message = $"Đã tạo mới {count} bản ghi lương cho tháng {dto.Month}/{dto.Year}." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] PayrollUpdateDto dto)
        {
            try
            {
                var result = await _payrollService.UpdatePayrollAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
