using AltenShop.Api.Models;
using AltenShop.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AltenShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly JsonFileService<List<User>> _usersService = new("users.json");
        private readonly IConfiguration _configuration;

        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("account")]
        public IActionResult Register(User user)
        {
            var users = _usersService.Read() ?? new List<User>();

            if (users.Any(u => u.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)))
                return BadRequest("Email already exists.");

            user.Id = users.Count > 0 ? users.Max(u => u.Id) + 1 : 1;
            users.Add(user);
            _usersService.Save(users);

            return Ok(true);
        }

        [HttpPost("token")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            var users = _usersService.Read() ?? new List<User>();
            var user = users.FirstOrDefault(u =>
                u.Email.Equals(login.Email, StringComparison.OrdinalIgnoreCase)
                && u.Password == login.Password);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];

            var key = Encoding.UTF8.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim("firstname", user.FirstName ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = jwtIssuer,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                email = user.Email,
                firstname = user.FirstName
            });
        }
    }
}
