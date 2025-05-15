import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { StockService } from '../../../../services/stock.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { StockTransfer } from '../../../../models/stock.model';
import { Warehouse } from '../../../../models/warehouse.model';

@Component({
  selector: 'app-stock-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Transfer Stock</h2>
    <mat-dialog-content>
      <div class="transfer-form">
        <p>Transfer {{ data.productName }} from {{ data.sourceWarehouseName }}</p>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Target Warehouse</mat-label>
          <mat-select [(ngModel)]="selectedWarehouseId">
            <mat-option *ngFor="let warehouse of warehouses" [value]="warehouse.id">
              {{ warehouse.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="quantity" min="1" [max]="data.quantity">
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onTransfer()" [disabled]="!isValid()">
        Transfer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .transfer-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class StockTransferDialogComponent {
  warehouses: Warehouse[] = [];
  selectedWarehouseId: number | null = null;
  quantity = 1;

  constructor(
    public dialogRef: MatDialogRef<StockTransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      productId: number;
      productName: string;
      sourceWarehouseId: number;
      sourceWarehouseName: string;
      quantity: number;
    },
    private warehouseService: WarehouseService,
    private stockService: StockService
  ) {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe((warehouses: Warehouse[]) => {
      this.warehouses = warehouses.filter((w: Warehouse) => w.id !== this.data.sourceWarehouseId.toString());
    });
  }

  isValid(): boolean {
    return this.selectedWarehouseId !== null && 
           this.quantity > 0 && 
           this.quantity <= this.data.quantity;
  }

  onTransfer(): void {
    if (!this.isValid()) return;

    const transfer: StockTransfer = {
      productId: this.data.productId,
      sourceWarehouseId: this.data.sourceWarehouseId,
      targetWarehouseId: this.selectedWarehouseId!,
      quantity: this.quantity
    };

    this.stockService.transferStock(transfer).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error transferring stock:', error);
        // You might want to show an error message to the user here
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 