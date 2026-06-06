using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRManagement.Core.DTOs.Candidates;
using HRManagement.API.Services;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatesController : ControllerBase
    {
        private readonly ICandidateService _candidateService;

        public CandidatesController(ICandidateService candidateService)
        {
            _candidateService = candidateService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CandidateDto>>> GetAll()
        {
            var result = await _candidateService.GetAllAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CandidateDto>> Create([FromBody] CandidateCreateDto dto)
        {
            try
            {
                var result = await _candidateService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<CandidateDto>> UpdateStatus(Guid id, [FromBody] CandidateUpdateStatusDto dto)
        {
            try
            {
                var result = await _candidateService.UpdateStatusAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/onboard")]
        public async Task<ActionResult<CandidateDto>> Onboard(Guid id)
        {
            try
            {
                var result = await _candidateService.OnboardAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
