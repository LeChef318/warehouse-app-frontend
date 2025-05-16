// src/app/components/categories/category-create/category-create.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
  });
  
  submitting = false;
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    this.categoryService.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.snackBar.open('Category created successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.snackBar.open('Failed to create category', 'Close', {
          duration: 5000
        });
        this.submitting = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/categories']);
  }
}