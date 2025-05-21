import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For mat-spinner
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

// Mock AuthService
class MockAuthService {
  login(credentials: any) {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return of({ uid: 'test-uid', email: 'test@example.com' });
    }
    return throwError(() => new Error('Invalid credentials'));
  }
  // Add other methods if called by the component, e.g., Google login
  loginWithGoogle() {
    return Promise.resolve({ user: { uid: 'google-uid' } });
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]), // Basic router testing setup
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        // Router is already provided by RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger component initialization
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the main container and card with correct classes', () => {
    expect(compiled.querySelector('.login-container')).toBeTruthy();
    const loginCard = compiled.querySelector('.login-card');
    expect(loginCard).toBeTruthy();
    // The new styles are applied directly to .login-card,
    // so checking its existence is key.
  });

  it('should display the login header with logo, title, and subtitle', () => {
    const header = compiled.querySelector('.login-header');
    expect(header).toBeTruthy();
    expect(header?.querySelector('.login-logo')).toBeTruthy();
    expect(header?.querySelector('h1')?.textContent).toContain('Iniciar Sesión');
    expect(header?.querySelector('p')?.textContent).toContain('Bienvenido de nuevo a IDS Informática Villa Claraa');
  });

  it('should have a form with class "login-form"', () => {
    expect(compiled.querySelector('form.login-form')).toBeTruthy();
  });

  it('should have a mat-form-field for email', () => {
    const emailField = compiled.querySelector('mat-form-field input[formControlName="email"]');
    expect(emailField).toBeTruthy();
    expect(emailField?.getAttribute('type')).toBe('email');
    // Check for mat-label content if possible, or just its presence
    const emailLabel = compiled.querySelector('mat-form-field mat-label');
    // This check depends on how Angular Material renders labels in tests.
    // It's often easier to check the input's placeholder or formControlName.
  });
  
  it('should have a mat-form-field for password', () => {
    const passwordField = compiled.querySelector('mat-form-field input[formControlName="password"]');
    expect(passwordField).toBeTruthy();
    // Initially type="password" due to hidePassword = true
    expect(passwordField?.getAttribute('type')).toBe('password');
  });

  it('should have a "Recordarme" checkbox', () => {
    const checkbox = compiled.querySelector('mat-checkbox[formControlName="rememberMe"]');
    expect(checkbox).toBeTruthy();
    expect(checkbox?.textContent).toContain('Recordarme');
  });

  it('should have a "Forgot password?" link', () => {
    const forgotPasswordLink = compiled.querySelector('a.forgot-password');
    expect(forgotPasswordLink).toBeTruthy();
    expect(forgotPasswordLink?.textContent).toContain('¿Olvidaste tu contraseña?');
    expect(forgotPasswordLink?.getAttribute('routerLink')).toBe('/recuperar-contrasena');
  });
  
  it('should have a submit button styled as a mat-raised-button with primary color', () => {
    const button = compiled.querySelector('button[type="submit"]');
    expect(button).toBeTruthy();
    expect(button?.hasAttribute('mat-raised-button')).toBe(true); // Check for directive
    // The color="primary" is an input to the directive, harder to check directly in DOM
    // but its presence implies the class mat-primary or similar will be added by Angular Material.
    // The custom styling applies on top of these Material styles.
    expect(button?.textContent?.trim()).toBe('Iniciar Sesión'); // Initial state without loading
  });

  it('should have a "Register here" link', () => {
    const registerLinkContainer = compiled.querySelector('.register-link');
    expect(registerLinkContainer).toBeTruthy();
    expect(registerLinkContainer?.textContent).toContain('¿No tienes una cuenta?');
    const registerLink = registerLinkContainer?.querySelector('a');
    expect(registerLink).toBeTruthy();
    expect(registerLink?.textContent).toContain('Regístrate aquí');
    expect(registerLink?.getAttribute('routerLink')).toBe('/register');
  });

  it('should disable the submit button if form is invalid', () => {
    component.loginForm.controls['email'].setValue(''); // Invalid state
    fixture.detectChanges();
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable the submit button if form is valid', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    fixture.detectChanges();
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  });
  
  it('should show spinner and disable button when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    const spinner = button.querySelector('mat-spinner');
    const span = button.querySelector('span');

    expect(button.disabled).toBeTrue();
    expect(spinner).toBeTruthy();
    expect(span?.textContent?.trim()).toBeFalsy(); // Span content should be hidden or empty
  });

});
