import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightStock]',
  standalone: true
})
export class HighlightStockDirective implements OnChanges {
  @Input('appHighlightStock') stock = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.applyStockStyle();
  }

  private applyStockStyle(): void {
    if (this.stock === 0) {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid var(--danger)');
      this.renderer.setStyle(this.el.nativeElement, 'background', 'rgba(239, 68, 68, 0.05)');
    } else if (this.stock < 10) {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid var(--warning)');
      this.renderer.setStyle(this.el.nativeElement, 'background', 'rgba(245, 158, 11, 0.05)');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid var(--success)');
      this.renderer.setStyle(this.el.nativeElement, 'background', 'rgba(16, 185, 129, 0.03)');
    }
  }
}
