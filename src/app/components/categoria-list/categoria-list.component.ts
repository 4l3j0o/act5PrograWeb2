import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria, CategoriaCreate } from '../../models/categoria.model';
import { CardHoverDirective } from '../../directives/card-hover.directive';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardHoverDirective],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];
  cargando = true;
  guardando = false;
  mensajeError = '';

  nuevaCategoria: CategoriaCreate = {
    nombre: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.cdr.markForCheck();

    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'Error al cargar categorías desde el backend.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  crearCategoria(): void {
    if (!this.nuevaCategoria.nombre || this.nuevaCategoria.nombre.trim().length < 3) {
      this.mensajeError = 'El nombre de la categoría debe tener al menos 3 caracteres.';
      this.cdr.markForCheck();
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.cdr.markForCheck();

    this.categoriaService.create(this.nuevaCategoria).subscribe({
      next: (creada) => {
        this.categorias.push(creada);
        this.nuevaCategoria = { nombre: '', descripcion: '' };
        this.guardando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'Error al crear la categoría.';
        this.guardando = false;
        this.cdr.markForCheck();
      }
    });
  }

  eliminarCategoria(id: number, nombre: string): void {
    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) {
      return;
    }

    this.categoriaService.delete(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== id);
        this.cdr.markForCheck();
      },
      error: () => {
        alert('No se pudo eliminar la categoría (podría tener productos asociados).');
      }
    });
  }
}
