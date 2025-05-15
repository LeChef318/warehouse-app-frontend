import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService, Product } from '../../../services/product.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    ProductFormComponent
  ],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private keycloakService = inject(KeycloakService);
  
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  
  constructor() {
    if (!this.keycloakService.isManager()) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to edit products.' }
      });
    }
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }
    
    this.loading = true;
    this.productService.getProduct(Number(id)).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onSubmit(productData: Partial<Product>): void {
    this.loading = true;
    this.error = null;
    
    this.productService.updateProduct(this.product!.id, productData).subscribe({
      next: (product) => {
        this.loading = false;
        this.router.navigate(['/products', product.id]);
      },
      error: (err) => {
        this.error = 'Failed to update product. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/products']);
  }
} 