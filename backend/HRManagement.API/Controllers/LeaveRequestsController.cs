using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HRManagement.API.Services;
using HRManagement.Core.DTOs.LeaveRequests;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ILeaveRequestService _leaveRequestService;

        public LeaveRequestsController(ILeaveRequestService leaveRequestService)
        {
            _leaveRequestService = leaveRequestService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // For simplicity in this version, any authenticated user can view all requests
            // In a real system, you'd check if User.IsInRole("Admin") to return all, otherwise return GetMy
            var result = await _leaveRequestService.GetAllRequestsAsync();
            return Ok(result);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMy()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var result = await _leaveRequestService.GetMyRequestsAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] LeaveRequestCreateDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            try
            {
                var result = await _leaveRequestService.SubmitRequestAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(Guid id, [FromBody] LeaveRequestApproveDto dto)
        {
            var approverIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(approverIdStr, out var approverId)) return Unauthorized();

            try
            {
                var success = await _leaveRequestService.ApproveRequestAsync(id, approverId, dto);
                if (!success) return NotFound(new { message = "Không tìm thấy đơn nghỉ phép." });
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
