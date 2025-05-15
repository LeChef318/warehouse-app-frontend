// src/app/components/products/product-list/product-list.component.ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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
  private dialog = inject(MatDialog);
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortedData: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'actions'];
  loading = false;
  error: string | null = null;
  isManager = false;
  
  // Search and Filter
  searchTerm = '';
  
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
      error: () => {
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

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
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

  deleteProduct(id: string, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(Number(id)).subscribe({
          next: () => {
            this.loadProducts();
          },
          error: () => {
            this.error = 'Failed to delete product. Please try again.';
          }
        });
      }
    });
  }
}