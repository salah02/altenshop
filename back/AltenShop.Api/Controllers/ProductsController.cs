using AltenShop.Api.Models;
using AltenShop.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AltenShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly JsonFileService<List<Product>> _service = new("products.json");

        [HttpGet]
        public IActionResult Get() => Ok(_service.Read() ?? new List<Product>());

        [Authorize]
        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            if (User.Identity.Name != "admin@admin.com") return Forbid();

            var products = _service.Read() ?? new List<Product>();
            product.Id = products.Count > 0 ? products.Max(p => p.Id) + 1 : 1;
            products.Add(product);
            _service.Save(products);
            return Ok(true);
        }

        [Authorize]
        [HttpPatch("{id}")]
        public IActionResult Update(int id, Product product)
        {
            if (User.Identity.Name != "admin@admin.com") return Forbid();
            var products = _service.Read() ?? new List<Product>();
            var existing = products.FirstOrDefault(p => p.Id == id);
            if (existing == null) return NotFound();
            products.Remove(existing);
            products.Add(product);
            _service.Save(products);
            return Ok(true);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (User.Identity.Name != "admin@admin.com") return Forbid();
            var products = _service.Read() ?? new List<Product>();
            var existing = products.FirstOrDefault(p => p.Id == id);
            if (existing == null) return NotFound();
            products.Remove(existing);
            _service.Save(products);
            return Ok(true);
        }
    }
}
