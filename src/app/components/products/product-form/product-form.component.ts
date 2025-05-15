import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() submitButtonText = 'Save';
  @Input() title = 'Product Form';
  
  @Output() productSubmit = new EventEmitter<Partial<Product>>();
  @Output() cancelRequest = new EventEmitter<void>();
  
  productForm!: FormGroup;
  categories: Category[] = [];
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
  }
  
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.error = 'Failed to load categories. Please try again.';
      }
    });
  }
  
  initForm(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.product?.description || '', [Validators.required, Validators.maxLength(500)]],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0)]],
      categoryId: [this.product?.categoryId || '', [Validators.required]]
    });
  }
  
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }
    
    const formData = this.productForm.value;
    this.productSubmit.emit(formData);
  }
  
  onCancel(): void {
    this.cancelRequest.emit();
  }
  
  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  // Form validation helpers
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.hasError(errorName) && control.touched;
  }
} 