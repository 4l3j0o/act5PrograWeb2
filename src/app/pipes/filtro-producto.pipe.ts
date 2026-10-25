import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../models/producto.model';

@Pipe({
  name: 'filtroProducto',
  standalone: true
})
export class FiltroProductoPipe implements PipeTransform {
  transform(productos: Producto[] | null, termino: string, categoriaId: number | null): Producto[] {
    if (!productos) return [];
    
    let resultado = productos;

    if (categoriaId && categoriaId > 0) {
      resultado = resultado.filter(p => p.categoriaId === categoriaId);
    }

    if (termino && termino.trim() !== '') {
      const query = termino.toLowerCase().trim();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
        (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(query))
      );
    }

    return resultado;
  }
}
