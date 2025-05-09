// src/app/components/products/product-list/product-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  isManager = false;
  
  // For search and filtering
  searchTerm = '';
  
  // For sorting
  sortedData: Product[] = [];
  
  // For pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  
  // Table columns
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'actions'];
  
  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.sortedData = [...this.filteredProducts];
        this.applyPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower) ||
      product.categoryName.toLowerCase().includes(searchTermLower)
    );
    
    this.sortedData = [...this.filteredProducts];
    this.pageIndex = 0;
    this.applyPagination();
  }
  
  sortData(sort: Sort): void {
    const data = [...this.filteredProducts];
    
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.applyPagination();
      return;
    }
    
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'category': return this.compare(a.categoryName, b.categoryName, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'stock': return this.compare(this.getTotalStock(a), this.getTotalStock(b), isAsc);
        default: return 0;
      }
    });
    
    this.applyPagination();
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyPagination();
  }
  
  applyPagination(): void {
    // This would normally be done on the server side
    // For client-side, we're just slicing the data
  }
  
  getTotalStock(product: Product): number {
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
  
  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }
  
  editProduct(id: number, event: Event): void {
    event.stopPropagation();
    
    if (this.isManager) {
      this.router.navigate(['/products', id, 'edit']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to edit products.' }
      });
    }
  }
  
  createProduct(): void {
    if (this.isManager) {
      this.router.navigate(['/products/create']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create products.' }
      });
    }
  }
  
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}