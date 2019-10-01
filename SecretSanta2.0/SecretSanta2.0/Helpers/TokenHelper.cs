using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SecretSanta2._0.Models;

namespace SecretSanta2._0.Helpers
{
    public class TokenHelper
    {
        public static dynamic GenerateToken(string email)
        {
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, SecurityHelper.Encrypt(AppSettingsModel.appSettings.JwtEmailEncryption, email)),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
			};

			var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AppSettingsModel.appSettings.JwtSecret));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken
			(
				AppSettingsModel.appSettings.AppDomain,
				AppSettingsModel.appSettings.AppAudience,
				claims,
				expires: DateTime.UtcNow.AddMonths(1),
				signingCredentials: creds
			);

			return new
			{
				token = new JwtSecurityTokenHandler().WriteToken(token)
			};
		}
    }
}