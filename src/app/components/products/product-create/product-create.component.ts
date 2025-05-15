import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService, Product } from '../../../services/product.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    ProductFormComponent
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private keycloakService = inject(KeycloakService);
  private categoryService = inject(CategoryService);
  
  loading = false;
  error: string | null = null;
  categories: Category[] = [];
  
  constructor() {
    if (!this.keycloakService.isManager()) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create products.' }
      });
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. You can still create a product, but category selection will be limited.';
        this.loading = false;
      }
    });
  }
  
  onSubmit(productData: Partial<Product>): void {
    this.loading = true;
    this.error = null;
    
    this.productService.createProduct(productData).subscribe({
      next: (product) => {
        this.loading = false;
        this.router.navigate(['/products', product.id]);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.error = 'Failed to create product. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/products']);
  }
} 