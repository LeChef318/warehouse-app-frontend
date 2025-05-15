import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockService } from '../../../services/stock.service';
import { Warehouse } from '../../../models/warehouse.model';

export interface StockDialogData {
  mode: 'create' | 'transfer';
  productId?: number;
  warehouseId?: number;
  warehouses: Warehouse[];
  currentQuantity?: number;
  stockId?: number;
}

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.scss']
})
export class StockDialogComponent {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  stockForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor() {
    this.stockForm = this.fb.group({
      warehouseId: [this.data.warehouseId || '', Validators.required],
      toWarehouseId: ['', Validators.required],
      quantity: [1, [
        Validators.required,
        Validators.min(1),
        ...(this.data.mode === 'transfer' ? [Validators.max(this.data.currentQuantity || 0)] : [])
      ]]
    });

    // Only require toWarehouseId for transfer mode
    if (this.data.mode === 'create') {
      this.stockForm.get('toWarehouseId')?.clearValidators();
      this.stockForm.get('toWarehouseId')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.stockForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.stockForm.value;

    if (this.data.mode === 'create') {
      this.stockService.createStock({
        productId: this.data.productId!,
        warehouseId: Number(formValue.warehouseId),
        quantity: formValue.quantity
      }).subscribe({
        next: (stock) => {
          this.loading = false;
          this.dialogRef.close(stock);
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to add stock. Please try again.';
        }
      });
    } else {
      this.stockService.transferStock({
        productId: this.data.productId!,
        sourceWarehouseId: this.data.warehouseId!,
        targetWarehouseId: Number(formValue.toWarehouseId),
        quantity: formValue.quantity
      }).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close({
            quantity: formValue.quantity,
            targetWarehouseId: Number(formValue.toWarehouseId)
          });
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to transfer stock. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 