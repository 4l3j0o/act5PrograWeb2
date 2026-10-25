import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { ProductoCreate } from '../../models/producto.model';
import { CardHoverDirective } from '../../directives/card-hover.directive';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardHoverDirective],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);

  isEditing = false;
  productoId = 0;
  guardando = false;
  mensajeError = '';

  categorias: Categoria[] = [];

  producto: ProductoCreate = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0
  };

  ngOnInit(): void {
    this.cargarCategorias();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditing = true;
      this.productoId = +idParam;
      this.cargarProducto(this.productoId);
    }
  }

  cargarCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        if (!this.isEditing && this.categorias.length > 0) {
          this.producto.categoriaId = this.categorias[0].id;
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las categorías.';
        this.cdr.markForCheck();
      }
    });
  }

  cargarProducto(id: number): void {
    this.productoService.getById(id).subscribe({
      next: (data) => {
        this.producto = {
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          precio: data.precio,
          stock: data.stock,
          categoriaId: data.categoriaId
        };
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'Error al cargar el producto para edición.';
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (!this.validar()) return;

    this.guardando = true;
    this.mensajeError = '';
    this.cdr.markForCheck();

    if (this.isEditing) {
      this.productoService.update(this.productoId, this.producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: () => {
          this.mensajeError = 'Ocurrió un error al actualizar el producto.';
          this.guardando = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.productoService.create(this.producto).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: () => {
          this.mensajeError = 'Ocurrió un error al registrar el producto.';
          this.guardando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  validar(): boolean {
    if (!this.producto.nombre || this.producto.nombre.trim().length < 3) {
      this.mensajeError = 'El nombre del producto debe tener al menos 3 caracteres.';
      this.cdr.markForCheck();
      return false;
    }
    if (this.producto.precio <= 0) {
      this.mensajeError = 'El precio debe ser mayor a 0.';
      this.cdr.markForCheck();
      return false;
    }
    if (this.producto.stock < 0) {
      this.mensajeError = 'El stock no puede ser negativo.';
      this.cdr.markForCheck();
      return false;
    }
    if (!this.producto.categoriaId || this.producto.categoriaId <= 0) {
      this.mensajeError = 'Debes seleccionar una categoría válida.';
      this.cdr.markForCheck();
      return false;
    }
    return true;
  }
}
