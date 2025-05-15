// src/app/components/products/product-list/product-list.component.ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService, Product } from '../../../services/product.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Product>;
  
  private productService = inject(ProductService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortedData: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'actions'];
  loading = false;
  error: string | null = null;
  isManager = false;
  
  // Search and Filter
  searchTerm: string = '';
  
  // Sorting
  currentSort: Sort = { active: 'name', direction: 'asc' };
  
  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.sortedData = [...this.products];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortedData = [...this.filteredProducts];
  }
  
  sortData(event: Sort): void {
    this.currentSort = event;
    const data = [...this.filteredProducts];
    if (!event.active || event.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  getTotalStock(product: Product): number {
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
  
  viewProductDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }
  
  editProduct(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/products', id, 'edit']);
  }
  
  formatPrice(price: number): string {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(price);
  }

  createProduct(): void {
    this.router.navigate(['/products/create']);
  }
}