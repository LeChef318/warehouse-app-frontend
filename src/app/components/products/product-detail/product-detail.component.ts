import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../services/product.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  keycloakService = inject(KeycloakService);
  
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  
  // Table columns for stock information
  displayedColumns: string[] = ['warehouse', 'quantity', 'actions'];
  
  constructor() {
    if (!this.keycloakService.isAuthenticated()) {
      this.router.navigate(['/login']);
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
  
  onEdit(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit']);
    }
  }
  
  onDelete(): void {
    if (!this.product) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = 'Failed to delete product. Please try again.';
          this.loading = false;
        }
      });
    }
  }
  
  onBack(): void {
    this.router.navigate(['/products']);
  }
} 