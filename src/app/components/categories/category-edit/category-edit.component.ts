// src/app/components/categories/category-edit/category-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-edit',
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
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  categoryId!: number;
  category: Category | null = null;
  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
  });
  
  loading = true;
  submitting = false;
  error: string | null = null;
  
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.categoryId = +idParam;
      this.loadCategory();
    } else {
      this.error = 'Category ID is missing';
      this.loading = false;
    }
  }
  
  loadCategory(): void {
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.categoryForm.patchValue({
          name: category.name
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.error = 'Failed to load category. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    this.categoryService.updateCategory(this.categoryId, this.categoryForm.value).subscribe({
      next: () => {
        this.snackBar.open('Category updated successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.error('Error updating category:', err);
        this.snackBar.open('Failed to update category', 'Close', {
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