import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent implements AfterViewInit {
  @ViewChildren('serviceRow') serviceRows!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const options = {
          root: null,
          rootMargin: '-50px 0px',
          threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              // Una vez que se anima, dejamos de observar
              observer.unobserve(entry.target);
            }
          });
        }, options);

        // Observar cada fila de servicio
        this.serviceRows.forEach(row => {
          observer.observe(row.nativeElement);
        });
      }
    }, 100);
  }
}
