import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <img [src]="getProfileImageUrl()" alt="Profile" class="profile-image">
        <h3>{{ user?.nombre }} {{ user?.apellidos }}</h3>
      </div>
      <nav>
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon>dashboard</mat-icon>
          Panel
        </a>
        <a routerLink="/admin/users" routerLinkActive="active">
          <mat-icon>people</mat-icon>
          Usuarios
        </a>
        <a routerLink="/admin/reports" routerLinkActive="active">
          <mat-icon>assessment</mat-icon>
          Reportes
        </a>
        <a routerLink="/admin/settings" routerLinkActive="active">
          <mat-icon>settings</mat-icon>
          Configuración
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #181818;
      color: #fff;
      padding: 20px;
      box-shadow: 2px 0 8px rgba(0,0,0,0.2);
    }
    .sidebar-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .profile-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 10px;
      border: 3px solid #ff6b00;
      object-fit: cover;
      background: #222;
    }
    .sidebar-header h3 {
      color: #ff6b00;
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0;
    }
    nav a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #fff;
      text-decoration: none;
      transition: background 0.3s, color 0.3s;
      border-radius: 6px;
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 1rem;
    }
    nav a:hover {
      background: #232323;
      color: #ff6b00;
    }
    nav a.active {
      background: #ff6b00;
      color: #fff;
    }
    mat-icon {
      margin-right: 10px;
      color: #ff6b00;
    }
  `]
})
export class SidebarComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  getProfileImageUrl(): string {
    if (this.user?.fotoPerfil) {
      if (this.user.fotoPerfil.startsWith('http')) {
        return this.user.fotoPerfil;
      }
      return 'http://localhost:3000/' + this.user.fotoPerfil.replace(/^\\/, '');
    }
    return 'assets/images/default-avatar.png';
  }
} 