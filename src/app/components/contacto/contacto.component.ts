import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Suscribirse a los cambios del formulario para debug
    this.contactForm.statusChanges.subscribe(status => {
      console.log('Estado del formulario:', status);
      console.log('Valores del formulario:', this.contactForm.value);
      console.log('Errores del formulario:', this.contactForm.errors);
      console.log('¿Formulario válido?:', this.contactForm.valid);
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('email')) {
      return 'Por favor ingresa un email válido';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres`;
    }
    return '';
  }

  showSuccessDialog() {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: '¡Mensaje Enviado!',
        message: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
        buttonText: 'Aceptar'
      },
      width: '400px',
      panelClass: 'custom-dialog'
    });
  }

  showErrorDialog() {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Error',
        message: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
        buttonText: 'Intentar de nuevo'
      },
      width: '400px',
      panelClass: 'custom-dialog'
    });
  }

  onSubmit() {
    console.log('Intentando enviar formulario...');
    console.log('Estado del formulario:', this.contactForm.status);
    console.log('¿Formulario válido?:', this.contactForm.valid);
    console.log('Valores del formulario:', this.contactForm.value);

    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { nombre, email, mensaje } = this.contactForm.value;

      const emailData = {
        to: 'alain.sanchez@ids.alinet.cu',
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        text: `
          Nombre: ${nombre}
          Email: ${email}
          Mensaje: ${mensaje}
        `,
        html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong> ${mensaje}</p>
        `
      };

      this.http.post('https://www.alimaticvc.alinet.cu/api/send-email', emailData)
        .subscribe({
          next: () => {
            this.showSuccessDialog();
            this.contactForm.reset();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error al enviar el mensaje:', error);
            this.showErrorDialog();
            this.isSubmitting = false;
          }
        });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }
} 