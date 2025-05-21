import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  user: User | null = null;
  loading = false;
  error = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      carnetIdentidad: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fotoPerfil: ['']
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.perfilForm.patchValue({
        nombre: this.user.nombre,
        apellidos: this.user.apellidos,
        carnetIdentidad: this.user.carnetIdentidad,
        empresa: this.user.empresa,
        cargo: this.user.cargo,
        telefono: this.user.telefono,
        email: this.user.email,
        fotoPerfil: this.user.fotoPerfil
      });
      this.photoPreview = this.user.fotoPerfil || null;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // Subir la foto
      this.loading = true;
      this.authService.uploadProfilePhoto(file).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.perfilForm.patchValue({ fotoPerfil: response.user.fotoPerfil });
            this.user = response.user;
            this.photoPreview = response.user.fotoPerfil ?? null;
            this.showSuccessDialog();
          }
        },
        error: (error) => {
          this.error = 'Error al subir la foto. Intente nuevamente.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.perfilForm.value;

      this.authService.updateProfile(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccessDialog();
          }
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          this.error = 'Error al actualizar el perfil. Por favor, intente nuevamente.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  showSuccessDialog() {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: '¡Perfil Actualizado!',
        message: 'Tu perfil ha sido actualizado correctamente.',
        buttonText: 'Aceptar'
      },
      width: '400px',
      panelClass: 'custom-dialog'
    });
  }
} 