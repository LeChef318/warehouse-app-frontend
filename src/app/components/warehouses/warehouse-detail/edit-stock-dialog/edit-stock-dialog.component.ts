import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

export interface EditStockDialogData {
  warehouseId: number;
  productId: number;
  productName: string;
  currentQuantity: number;
}

type StockOperation = 'ADD' | 'REMOVE';

@Component({
  selector: 'app-edit-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Stock</h2>
    <mat-dialog-content>
      <form #editStockForm="ngForm">
        <p class="product-info">{{ data.productName }}</p>
        <p class="current-quantity">Current quantity: {{ data.currentQuantity }}</p>
        
        <mat-radio-group [(ngModel)]="operation" name="operation" class="operation-group">
          <mat-radio-button value="ADD">Add Stock</mat-radio-button>
          <mat-radio-button value="REMOVE">Remove Stock</mat-radio-button>
        </mat-radio-group>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Amount</mat-label>
          <input matInput type="number" [(ngModel)]="amount" name="amount" required min="1">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!editStockForm.form.valid || amount < 1"
              (click)="onSubmit()">
        Update Stock
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .product-info {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .current-quantity {
      margin-bottom: 1rem;
      color: rgba(0, 0, 0, 0.6);
    }
    .operation-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
  `]
})
export class EditStockDialogComponent {
  amount = 1;
  operation: StockOperation = 'ADD';

  constructor(
    public dialogRef: MatDialogRef<EditStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditStockDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.amount >= 1) {
      this.dialogRef.close({
        productId: this.data.productId,
        quantity: this.amount,
        operation: this.operation
      });
    }
  }
} 