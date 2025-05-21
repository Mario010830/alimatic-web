import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      carnetIdentidad: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  showSuccessDialog() {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: '¡Registro Exitoso!',
        message: 'Tu cuenta ha sido creada correctamente. Por favor, inicia sesión para continuar.',
        buttonText: 'Iniciar Sesión'
      },
      width: '400px',
      panelClass: 'custom-dialog'
    }).afterClosed().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;

      this.authService.register(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccessDialog();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error en el registro:', error);
          if (error.error && error.error.message) {
            this.error = error.error.message;
          } else if (error.status === 0) {
            this.error = 'No se pudo conectar con el servidor. Por favor, intente más tarde.';
          } else {
            this.error = 'Error al registrar usuario. Por favor, intente nuevamente.';
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 