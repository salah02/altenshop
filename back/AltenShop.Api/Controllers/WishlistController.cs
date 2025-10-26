using AltenShop.Api.Models;
using AltenShop.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AltenShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly JsonFileService<Dictionary<string, List<Product>>> _wishlistService = new("wishlists.json");
        private readonly JsonFileService<List<Product>> _productService = new("products.json");

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var email = GetUserEmail();
                if (email == null)
                    return Unauthorized("Utilisateur non authentifié.");

                var wishlists = _wishlistService.Read() ?? new Dictionary<string, List<Product>>();
                if (!wishlists.ContainsKey(email))
                    wishlists[email] = new List<Product>();

                return Ok(wishlists[email]);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur: {ex.Message}");
            }
        }

        [HttpPost("{productId}")]
        public IActionResult Add(int productId)
        {
            try
            {
                var email = GetUserEmail();
                if (email == null)
                    return Unauthorized("Utilisateur non authentifié.");

                var wishlists = _wishlistService.Read() ?? new Dictionary<string, List<Product>>();
                if (!wishlists.ContainsKey(email))
                    wishlists[email] = new List<Product>();

                var products = _productService.Read() ?? new List<Product>();
                var product = products.FirstOrDefault(p => p.Id == productId);
                if (product == null)
                    return NotFound("Produit introuvable.");

                if (wishlists[email].Any(p => p.Id == productId))
                    return BadRequest("Ce produit est déjà dans votre liste d’envies.");

                wishlists[email].Add(product);
                _wishlistService.Save(wishlists);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur: {ex.Message}");
            }
        }

        [HttpDelete("{productId}")]
        public IActionResult Remove(int productId)
        {
            try
            {
                var email = GetUserEmail();
                if (email == null)
                    return Unauthorized("Utilisateur non authentifié.");

                var wishlists = _wishlistService.Read() ?? new Dictionary<string, List<Product>>();
                if (!wishlists.ContainsKey(email))
                    return NotFound("Aucune liste trouvée pour cet utilisateur.");

                wishlists[email].RemoveAll(p => p.Id == productId);
                _wishlistService.Save(wishlists);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur: {ex.Message}");
            }
        }

        private string? GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value
                ?? User.FindFirst("email")?.Value
                ?? User.Identity?.Name;
        }
    }
}
