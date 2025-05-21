import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  template: `
    <app-header *ngIf="!isLoginPage && !isAdminRoute"></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isLoginPage && !isAdminRoute"></app-footer>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 64px - 300px);
      padding-top: 64px;
    }
  `]
})
export class AppComponent {
  constructor(public router: Router) {}

  title = 'alimatic-web';

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
