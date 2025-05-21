import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkAuthStatus();
    }
  }

  private checkAuthStatus(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      this.isAuthenticatedSubject.next(!!token);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token && this.isBrowser) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        if (response.user && this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isBrowser ? this.isAuthenticatedSubject.value : false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  validateToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-token`, {});
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }

  getCurrentUser(): User | null {
    let user = this.currentUserSubject.value;
    if (!user && this.isBrowser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      }
    }
    return user;
  }

  updateProfile(userData: Partial<User>): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  uploadProfilePhoto(file: File): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('fotoPerfil', file);
    const token = this.getToken();
    console.log('Token al subir foto:', token);

    return this.http.post<AuthResponse>(`${this.apiUrl}/upload-photo`, formData)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }
} 