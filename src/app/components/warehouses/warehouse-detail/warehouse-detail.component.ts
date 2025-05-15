// src/app/components/warehouses/warehouse-detail/warehouse-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { StockTransferDialogComponent } from './stock-transfer-dialog/stock-transfer-dialog.component';
import { AddStockDialogComponent } from './add-stock-dialog/add-stock-dialog.component';
import { EditStockDialogComponent } from './edit-stock-dialog/edit-stock-dialog.component';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  private dialog = inject(MatDialog);
  
  warehouse: Warehouse | null = null;
  loading = true;
  error: string | null = null;
  isManager = false;
  
  // Updated to include productName
  displayedColumns: string[] = ['productName', 'quantity', 'actions'];
  
  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();

    this.route.paramMap.subscribe(params => {
      const warehouseId = params.get('id');
      if (warehouseId) {
        this.loadWarehouse(warehouseId);
      } else {
        this.error = 'Warehouse ID not provided';
        this.loading = false;
      }
    });
  }
  
  loadWarehouse(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.warehouseService.getWarehouse(Number(id)).subscribe({
      next: (data) => {
        this.warehouse = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(`Error loading warehouse with ID ${id}:`, err);
        this.error = 'Failed to load warehouse details. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  getTotalQuantity(): number {
    if (!this.warehouse) return 0;
    return this.warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
  
  goBack(): void {
    this.router.navigate(['/warehouses']);
  }
  
  editWarehouse(): void {
    if (this.isManager) {
      this.router.navigate(['/warehouses', this.warehouse?.id, 'edit']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to edit warehouses.' }
      });
    }
  }

  openTransferDialog(stock: { productId: number; productName: string; quantity: number }): void {
    if (!this.isManager || !this.warehouse) return;

    const dialogRef = this.dialog.open(StockTransferDialogComponent, {
      width: '400px',
      data: {
        productId: stock.productId,
        productName: stock.productName,
        sourceWarehouseId: this.warehouse.id,
        sourceWarehouseName: this.warehouse.name,
        quantity: stock.quantity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWarehouse(this.warehouse!.id.toString());
      }
    });
  }

  openEditStockDialog(stock: { productId: number; productName: string; quantity: number }): void {
    if (!this.isManager || !this.warehouse) return;

    const dialogRef = this.dialog.open(EditStockDialogComponent, {
      width: '400px',
      data: {
        warehouseId: this.warehouse.id,
        productId: stock.productId,
        productName: stock.productName,
        currentQuantity: stock.quantity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.warehouseService.updateStock(
          Number(this.warehouse!.id),
          result.productId,
          result.quantity,
          result.operation
        ).subscribe({
          next: () => {
            this.loadWarehouse(this.warehouse!.id.toString());
          },
          error: (error) => {
            console.error('Error updating stock:', error);
            // TODO: Show error message to user
          }
        });
      }
    });
  }

  openAddStockDialog(): void {
    if (!this.isManager || !this.warehouse) return;

    const dialogRef = this.dialog.open(AddStockDialogComponent, {
      width: '400px',
      data: {
        warehouseId: this.warehouse.id,
        warehouseName: this.warehouse.name,
        currentStocks: this.warehouse.stocks.map(stock => ({ productId: stock.productId }))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.warehouseService.addStock(
          Number(this.warehouse!.id),
          result.productId,
          result.quantity
        ).subscribe({
          next: () => {
            this.loadWarehouse(this.warehouse!.id.toString());
          },
          error: (error) => {
            console.error('Error adding stock:', error);
            // TODO: Show error message to user
          }
        });
      }
    });
  }
}