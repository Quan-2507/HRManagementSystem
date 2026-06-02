using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRManagement.API.Services;
using HRManagement.Core.DTOs.Auth;

namespace HRManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = System.DateTime.UtcNow.AddHours(2)
            };

            Response.Cookies.Append("token", response.Token, cookieOptions);

            return Ok(new { message = "Login successful", fullName = response.FullName, email = response.Email });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token", new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax
            });
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterRequest request)
        {
            var success = await _authService.RegisterAdminAsync(request.Email, request.Password, request.FullName);
            if (!success)
            {
                return BadRequest(new { message = "Registration failed" });
            }

            return Ok(new { message = "Admin registered successfully" });
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}
