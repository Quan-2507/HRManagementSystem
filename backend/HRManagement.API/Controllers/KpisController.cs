using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRManagement.Core.DTOs.Kpis;
using HRManagement.API.Services;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KpisController : ControllerBase
    {
        private readonly IKpiService _kpiService;

        public KpisController(IKpiService kpiService)
        {
            _kpiService = kpiService;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmployeeKpiDto>>> GetAll([FromQuery] string? period)
        {
            var result = await _kpiService.GetAllKpisAsync(period);
            return Ok(result);
        }

        [HttpGet("my")]
        public async Task<ActionResult<List<EmployeeKpiDto>>> GetMyKpis([FromQuery] Guid employeeId)
        {
            // Ideally we get EmployeeId from JWT token. We use query param for simplicity.
            var result = await _kpiService.GetMyKpisAsync(employeeId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeKpiDto>> Create([FromBody] EmployeeKpiCreateDto dto)
        {
            try
            {
                var result = await _kpiService.CreateKpiAsync(dto);
                return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeKpiDto>> Update(Guid id, [FromBody] EmployeeKpiUpdateDto dto)
        {
            try
            {
                var result = await _kpiService.UpdateKpiAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _kpiService.DeleteKpiAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
