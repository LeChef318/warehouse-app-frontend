import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService, Category, Product } from '../../../../services/category.service';

export interface AddStockDialogData {
  warehouseId: number;
  warehouseName: string;
  currentStocks: { productId: number }[];
}

@Component({
  selector: 'app-add-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Add Stock</h2>
    <mat-dialog-content>
      <form #addStockForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategoryId" name="categoryId" required (selectionChange)="onCategoryChange()">
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product</mat-label>
          <mat-select [(ngModel)]="selectedProductId" name="productId" required [disabled]="!selectedCategoryId || loadingProducts">
            <mat-option *ngFor="let product of availableProducts" [value]="product.id">
              {{ product.name }}
            </mat-option>
          </mat-select>
          <mat-spinner *ngIf="loadingProducts" diameter="20" class="spinner"></mat-spinner>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="quantity" name="quantity" required min="1">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!addStockForm.form.valid || quantity <= 0 || loadingProducts"
              (click)="onSubmit()">
        Add Stock
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .spinner {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  `]
})
export class AddStockDialogComponent implements OnInit {
  selectedCategoryId: number | null = null;
  selectedProductId: number | null = null;
  quantity: number = 0;
  categories: Category[] = [];
  products: Product[] = [];
  availableProducts: Product[] = [];
  loadingProducts = false;

  constructor(
    public dialogRef: MatDialogRef<AddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddStockDialogData,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // TODO: Show error message to user
      }
    });
  }

  onCategoryChange(): void {
    if (!this.selectedCategoryId) {
      this.products = [];
      this.availableProducts = [];
      this.selectedProductId = null;
      return;
    }

    this.loadingProducts = true;
    this.products = [];
    this.availableProducts = [];
    this.selectedProductId = null;

    this.categoryService.getProductsByCategory(this.selectedCategoryId).subscribe({
      next: (products) => {
        this.products = products;
        // Filter out products that are already in the warehouse
        this.availableProducts = products.filter(product => 
          !this.data.currentStocks.some(stock => stock.productId === product.id)
        );
        this.loadingProducts = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
        // TODO: Show error message to user
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.selectedProductId && this.quantity > 0) {
      this.dialogRef.close({
        productId: this.selectedProductId,
        quantity: this.quantity
      });
    }
  }
} 