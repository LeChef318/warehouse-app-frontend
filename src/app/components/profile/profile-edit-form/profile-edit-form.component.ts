import { Component, EventEmitter, Input, Output, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile, UserUpdate } from '../../../models/user.model';

@Component({
  selector: 'app-profile-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile-edit-form.component.html',
  styleUrls: ['./profile-edit-form.component.scss']
})
export class ProfileEditFormComponent implements OnChanges {
  @Input() profile: UserProfile | null = null;
  @Input() loading = false;
  @Output() saveProfile = new EventEmitter<UserUpdate>();
  @Output() cancelEdit = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form: FormGroup;

  // Validation patterns
  private readonly usernamePattern = /^[a-zA-Z0-9._-]{3,50}$/;
  private readonly namePattern = /^[a-zA-Z-]+$/;

  constructor() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(this.usernamePattern),
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.minLength(8)
      ]],
      confirmPassword: [''],
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
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.updateConfirmPasswordValidation();
    });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Update confirmPassword validation based on password value
  private updateConfirmPasswordValidation() {
    const password = this.form.get('password');
    const confirmPassword = this.form.get('confirmPassword');

    if (password?.value) {
      confirmPassword?.setValidators([Validators.required]);
    } else {
      confirmPassword?.clearValidators();
    }
    confirmPassword?.updateValueAndValidity();
  }

  ngOnChanges(): void {
    if (this.profile) {
      this.form.patchValue({
        username: this.profile.username,
        firstname: this.profile.firstname,
        lastname: this.profile.lastname
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const update: UserUpdate = {};
      
      // Only include fields that have changed
      if (this.form.get('username')?.dirty) {
        update.username = this.form.get('username')?.value;
      }
      if (this.form.get('password')?.value) {
        update.password = this.form.get('password')?.value;
      }
      if (this.form.get('firstname')?.dirty) {
        update.firstname = this.form.get('firstname')?.value;
      }
      if (this.form.get('lastname')?.dirty) {
        update.lastname = this.form.get('lastname')?.value;
      }

      this.saveProfile.emit(update);
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
} 