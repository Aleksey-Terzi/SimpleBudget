﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using SimpleBudget.API.Options;
using SimpleBudget.Data;

namespace SimpleBudget.API
{
    public class TokenService
    {
        public enum Status { WrongUsername, WrongPassword, Success }

        private readonly JwtOptions _jwt;
        private readonly UserSearch _userSearch;

        public TokenService(IOptions<JwtOptions> jwt, UserSearch userSearch)
        {
            _jwt = jwt.Value;
            _userSearch = userSearch;
        }

        public async Task<(string? Token, Status Status)> GenerateTokenAsync(string username, string password)
        {
            var user = await _userSearch.SelectFirst(x => x.Name == username);
            if (user == null)
                return (null, Status.WrongUsername);

            if (!string.Equals(user.Password, password))
                return (null, Status.WrongPassword);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddHours(_jwt.ExpiresInHours),
                signingCredentials: credentials
            );

            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return (token, Status.Success);
        }
    }
}
