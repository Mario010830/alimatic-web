import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('provideText') provideText!: ElementRef;
  @ViewChild('provideImages') provideImages!: ElementRef;
  @ViewChild('servicesLeft') servicesLeft!: ElementRef;
  @ViewChild('servicesRight') servicesRight!: ElementRef;

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      // Animación para la sección provide
      if (this.provideText && this.provideImages) {
        const provideOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.2
        };
        const provideObserver = new window.IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.target === this.provideText.nativeElement) {
              if (entry.isIntersecting) {
                this.provideText.nativeElement.classList.add('animate-left');
              } else {
                this.provideText.nativeElement.classList.remove('animate-left');
              }
            }
            if (entry.target === this.provideImages.nativeElement) {
              if (entry.isIntersecting) {
                this.provideImages.nativeElement.classList.add('animate-right');
              } else {
                this.provideImages.nativeElement.classList.remove('animate-right');
              }
            }
          });
        }, provideOptions);
        provideObserver.observe(this.provideText.nativeElement);
        provideObserver.observe(this.provideImages.nativeElement);
      }

      // Animación para la sección services
      if (this.servicesLeft && this.servicesRight) {
        const servicesOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        };
        const servicesObserver = new window.IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.target === this.servicesLeft.nativeElement) {
              if (entry.isIntersecting) {
                this.servicesLeft.nativeElement.classList.add('animate-up');
              }
            }
            if (entry.target === this.servicesRight.nativeElement) {
              if (entry.isIntersecting) {
                this.servicesRight.nativeElement.classList.add('animate-up');
              }
            }
          });
        }, servicesOptions);
        servicesObserver.observe(this.servicesLeft.nativeElement);
        servicesObserver.observe(this.servicesRight.nativeElement);

        // Fallback: Si después de 1 segundo no se aplicó la animación, forzarla
        setTimeout(() => {
          if (!this.servicesLeft.nativeElement.classList.contains('animate-up')) {
            this.servicesLeft.nativeElement.classList.add('animate-up');
          }
          if (!this.servicesRight.nativeElement.classList.contains('animate-up')) {
            this.servicesRight.nativeElement.classList.add('animate-up');
          }
        }, 1000);
      }
    }
  }
}
