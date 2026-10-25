import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {
  transform(stock: number | undefined | null): string {
    if (stock === undefined || stock === null || stock <= 0) {
      return 'Sin Stock';
    }
    if (stock < 10) {
      return `Últimas ${stock} unidades`;
    }
    return `${stock} en stock`;
  }
}
