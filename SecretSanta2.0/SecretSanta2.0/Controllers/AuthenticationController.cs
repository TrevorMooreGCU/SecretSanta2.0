using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using SecretSanta2._0.Models;
using SecretSanta2._0.Helpers;
using SecretSanta2._0.Services.Business;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SecretSanta2._0.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
    [Route("api/[controller]")]
	public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService _authenticationService)
        {
            this._authenticationService = _authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("Google")]
        public async Task<IActionResult> AuthenticateGoogleToken([FromBody]TokenModel token)
        {
            try
            {
				return Ok
				(
					await _authenticationService.AuthenticateGoogleToken(token, HttpContext.Response)
				);
            }
            catch (Exception ex)
            {
				LoggerHelper.Log(ex);
				return BadRequest(ex.Message);
            }
        }
	}
}