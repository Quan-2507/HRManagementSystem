using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRManagement.Core.DTOs.Payrolls;
using HRManagement.API.Services;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayrollsController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollsController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PayrollDto>>> GetPayrolls([FromQuery] int month, [FromQuery] int year)
        {
            var result = await _payrollService.GetByMonthYearAsync(month, year);
            return Ok(result);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<List<PayrollSummaryDto>>> GetPayrollSummary([FromQuery] int month, [FromQuery] int year)
        {
            var result = await _payrollService.GetPayrollSummaryTreeAsync(month, year);
            return Ok(result);
        }

        [HttpPost("generate")]
        public async Task<ActionResult<int>> GeneratePayroll([FromBody] PayrollGenerateDto dto)
        {
            var count = await _payrollService.GeneratePayrollAsync(dto.Month, dto.Year);
            return Ok(new { Count = count, Message = $"Generated {count} payroll records." });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PayrollDto>> UpdatePayroll(Guid id, [FromBody] PayrollUpdateDto dto)
        {
            try
            {
                var result = await _payrollService.UpdatePayrollAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("execute-payment")]
        public ActionResult ExecutePayment()
        {
            // Simulate processing bank payment
            return Ok(new { Message = "Payment execution started successfully. Transactions are being processed." });
        }
    }
}
