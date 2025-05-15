import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../../../services/product.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  template: `
    <div class="product-create-container">
      <div class="page-header">
        <button class="back-button" routerLink="/products">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back to Products
        </button>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
      
      <app-product-form 
        *ngIf="!error"
        title="Add New Product"
        submitButtonText="Create Product"
        [loading]="loading"
        [error]="error"
        (productSubmit)="onSubmit($event)"
        (cancelRequest)="onCancel()"
      ></app-product-form>
    </div>
  `,
  styles: [`
    @import '../../../../styles/variables';
    
    .product-create-container {
      width: 100%;
      max-width: 100%;
    }
    
    .page-header {
      margin-bottom: 1.5rem;
    }
    
    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: $primary-color;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
      
      svg {
        color: $primary-color;
      }
    }
    
    .error-message {
      background-color: #ffebee;
      color: #e53935;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
    }
  `]
})
export class ProductCreateComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private keycloakService = inject(KeycloakService);
  
  loading = false;
  error: string | null = null;
  
  constructor() {
    if (!this.keycloakService.isManager()) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create products.' }
      });
    }
  }
  
  onSubmit(productData: any): void {
    this.loading = true;
    this.error = null;
    
    this.productService.createProduct(productData).subscribe({
      next: (product) => {
        this.loading = false;
        this.router.navigate(['/products', product.id]);
      },
      error: (err) => {
        this.error = 'Failed to create product. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/products']);
  }
} 