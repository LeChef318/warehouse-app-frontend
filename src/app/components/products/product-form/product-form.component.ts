import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() title = 'Product Form';
  @Input() submitButtonText = 'Submit';
  @Input() product: Product | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() categories: Category[] = [];
  
  @Output() productSubmit = new EventEmitter<Partial<Product>>();
  @Output() cancelRequest = new EventEmitter<void>();
  
  productForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    if (this.product) {
      this.updateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.updateForm();
    }
  }

  private updateForm(): void {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        categoryId: this.product.categoryId
      });
    }
  }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productSubmit.emit(this.productForm.value);
    }
  }
  
  onCancel(): void {
    this.cancelRequest.emit();
  }
} 