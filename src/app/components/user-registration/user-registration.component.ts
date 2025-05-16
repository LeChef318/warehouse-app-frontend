import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  registrationForm: FormGroup;
  loading = false;
  error: string | null = null;

  // Validation patterns
  private readonly usernamePattern = /^[a-zA-Z0-9._-]{3,50}$/;
  private readonly namePattern = /^[a-zA-Z-]+$/;

  constructor() {
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(this.usernamePattern),
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [Validators.required]],
      firstname: ['', [
        Validators.required,
        Validators.pattern(this.namePattern)
      ]],
      lastname: ['', [
        Validators.required,
        Validators.pattern(this.namePattern)
      ]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Subscribe to password changes to update confirmPassword validation
    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.updateConfirmPasswordValidation();
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  private updateConfirmPasswordValidation() {
    const password = this.registrationForm.get('password');
    const confirmPassword = this.registrationForm.get('confirmPassword');

    if (password?.value) {
      confirmPassword?.setValidators([Validators.required]);
    } else {
      confirmPassword?.clearValidators();
    }
    confirmPassword?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = { ...this.registrationForm.value };
      delete formData.confirmPassword; // Remove confirmPassword before sending to API

      this.http.post(`${environment.apiUrl}/users/register`, formData)
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error?.message || 'Registration failed. Please try again.';
          }
        });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 