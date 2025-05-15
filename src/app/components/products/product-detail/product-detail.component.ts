import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { StockDialogComponent } from '../../shared/stock-dialog/stock-dialog.component';
import { EditStockDialogComponent } from '../../warehouses/warehouse-detail/edit-stock-dialog/edit-stock-dialog.component';
import { Stock } from '../../../models/stock.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private warehouseService = inject(WarehouseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public keycloakService = inject(KeycloakService);
  
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  displayedColumns = ['warehouse', 'quantity', 'actions'];
  
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
      error: () => {
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onBack(): void {
    this.router.navigate(['/products']);
  }
  
  onEdit(): void {
    this.router.navigate(['/products', this.product?.id, 'edit']);
  }
  
  onDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.productService.deleteProduct(this.product!.id).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: () => {
          this.error = 'Failed to delete product. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  addStock(): void {
    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        const dialogRef = this.dialog.open(StockDialogComponent, {
          width: '400px',
          data: {
            mode: 'create',
            productId: this.product?.id,
            warehouses: warehouses
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.snackBar.open('Stock added successfully', 'Close', { duration: 3000 });
            this.loadProduct();
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load warehouses', 'Close', { duration: 3000 });
      }
    });
  }

  transferStock(stock: Stock): void {
    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        const dialogRef = this.dialog.open(StockDialogComponent, {
          width: '400px',
          data: {
            mode: 'transfer',
            productId: this.product?.id,
            warehouseId: stock.warehouseId,
            currentQuantity: stock.quantity,
            warehouses: warehouses.filter(w => w.id !== stock.warehouseId.toString())
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loading = true;
            // First, update the local stock data to reflect the transfer
            if (this.product) {
              const sourceStock = this.product.stocks.find(s => s.warehouseId === stock.warehouseId);
              if (sourceStock) {
                sourceStock.quantity -= result.quantity;
                // Remove the stock entry if quantity becomes 0
                if (sourceStock.quantity <= 0) {
                  this.product.stocks = this.product.stocks.filter(s => s.warehouseId !== stock.warehouseId);
                }
              }

              // Add or update the target warehouse stock
              const targetStock = this.product.stocks.find(s => s.warehouseId === result.targetWarehouseId);
              if (targetStock) {
                targetStock.quantity += result.quantity;
              } else {
                // Find the warehouse name for the new stock entry
                const targetWarehouse = warehouses.find(w => w.id === result.targetWarehouseId.toString());
                if (targetWarehouse) {
                  this.product.stocks.push({
                    id: 0, // This will be updated by the server
                    productId: this.product.id,
                    productName: this.product.name,
                    warehouseId: result.targetWarehouseId,
                    warehouseName: targetWarehouse.name,
                    quantity: result.quantity
                  });
                }
              }
            }
            
            // Then refresh from server to ensure consistency
            this.productService.getProduct(this.product!.id).subscribe({
              next: (updatedProduct) => {
                this.product = updatedProduct;
                this.loading = false;
                this.snackBar.open('Stock transferred successfully', 'Close', { duration: 3000 });
              },
              error: () => {
                this.loading = false;
                this.error = 'Failed to refresh product details. Please try again.';
                this.snackBar.open('Stock transferred but failed to refresh view', 'Close', { duration: 3000 });
              }
            });
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load warehouses', 'Close', { duration: 3000 });
      }
    });
  }

  editStock(stock: Stock): void {
    const dialogRef = this.dialog.open(EditStockDialogComponent, {
      width: '400px',
      data: {
        warehouseId: stock.warehouseId,
        productId: this.product?.id,
        productName: this.product?.name,
        currentQuantity: stock.quantity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.warehouseService.updateStock(
          Number(stock.warehouseId),
          this.product!.id,
          result.quantity,
          result.operation
        ).subscribe({
          next: () => {
            this.snackBar.open('Stock updated successfully', 'Close', { duration: 3000 });
            this.loadProduct();
          },
          error: () => {
            this.snackBar.open('Failed to update stock', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  private loadProduct(): void {
    if (!this.product) return;
    
    this.loading = true;
    this.productService.getProduct(this.product.id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to refresh product details. Please try again.';
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(price);
  }
} 