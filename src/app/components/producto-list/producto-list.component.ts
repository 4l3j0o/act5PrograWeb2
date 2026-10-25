import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { HighlightStockDirective } from '../../directives/highlight-stock.directive';
import { CardHoverDirective } from '../../directives/card-hover.directive';
import { PrecioFormatPipe } from '../../pipes/precio-format.pipe';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';
import { FiltroProductoPipe } from '../../pipes/filtro-producto.pipe';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HighlightStockDirective,
    CardHoverDirective,
    PrecioFormatPipe,
    StockStatusPipe,
    FiltroProductoPipe
  ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  errorMensaje = '';

  busqueda = '';
  categoriaSeleccionada: number | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMensaje = '';
    this.cdr.markForCheck();

    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMensaje = 'No se pudo conectar con el servidor backend.';
        this.cdr.markForCheck();
      }
    });

    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMensaje = 'Error al cargar productos. Asegúrate de que el backend .NET esté corriendo.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  eliminarProducto(id: number, nombre: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${nombre}"?`)) {
      return;
    }

    this.productoService.delete(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        alert('Error al intentar eliminar el producto.');
      }
    });
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get valorTotalInventario(): number {
    return this.productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  }

  get productosBajoStock(): number {
    return this.productos.filter(p => p.stock < 10).length;
  }
}
