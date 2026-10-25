import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precioFormat',
  standalone: true
})
export class PrecioFormatPipe implements PipeTransform {
  transform(valor: number | undefined | null, moneda = 'USD'): string {
    if (valor === undefined || valor === null) return '$0.00';
    return `$ ${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${moneda}`;
  }
}
