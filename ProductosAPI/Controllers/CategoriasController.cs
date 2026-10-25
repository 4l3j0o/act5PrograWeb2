using Microsoft.AspNetCore.Mvc;
using ProductosAPI.Dtos;
using ProductosAPI.Services;

namespace ProductosAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly CategoriaService _service;

    public CategoriasController(CategoriaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoriaDto>>> GetAll()
    {
        var categorias = await _service.ObtenerTodas();
        return Ok(categorias);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoriaDto>> GetById(int id)
    {
        var categoria = await _service.ObtenerPorId(id);
        if (categoria == null) return NotFound(new { mensaje = "Categoría no encontrada." });
        return Ok(categoria);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaDto>> Create([FromBody] CategoriaCreateDto dto)
    {
        var categoria = await _service.Crear(dto);
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoriaCreateDto dto)
    {
        var resultado = await _service.Actualizar(id, dto);
        if (!resultado) return NotFound(new { mensaje = "Categoría no encontrada." });
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var resultado = await _service.Eliminar(id);
        if (!resultado) return NotFound(new { mensaje = "Categoría no encontrada." });
        return NoContent();
    }
}
