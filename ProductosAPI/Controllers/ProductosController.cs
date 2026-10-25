using Microsoft.AspNetCore.Mvc;
using ProductosAPI.Dtos;
using ProductosAPI.Services;

namespace ProductosAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly ProductoService _service;

    public ProductosController(ProductoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductoDto>>> GetAll()
    {
        var productos = await _service.ObtenerTodos();
        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductoDto>> GetById(int id)
    {
        var producto = await _service.ObtenerPorId(id);
        if (producto == null) return NotFound(new { mensaje = "Producto no encontrado." });
        return Ok(producto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductoDto>> Create([FromBody] ProductoCreateDto dto)
    {
        var producto = await _service.Crear(dto);
        if (producto == null) return BadRequest(new { mensaje = "La categoría especificada no existe." });
        return CreatedAtAction(nameof(GetById), new { id = producto.Id }, producto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductoCreateDto dto)
    {
        var resultado = await _service.Actualizar(id, dto);
        if (!resultado) return NotFound(new { mensaje = "Producto o categoría no encontrado." });
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var resultado = await _service.Eliminar(id);
        if (!resultado) return NotFound(new { mensaje = "Producto no encontrado." });
        return NoContent();
    }
}
