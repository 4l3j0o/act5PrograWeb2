import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCardHover]',
  standalone: true
})
export class CardHoverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-4px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 12px 24px -6px rgba(79, 70, 229, 0.3)');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', 'rgba(79, 70, 229, 0.5)');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'var(--shadow-lg)');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', 'var(--border)');
  }
}
