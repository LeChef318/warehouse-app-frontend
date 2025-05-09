// src/app/components/warehouses/warehouse-create/warehouse-create.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-create',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    WarehouseFormComponent
  ],
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.scss']
})
export class WarehouseCreateComponent {
  private warehouseService = inject(WarehouseService);
  private router = inject(Router);
  
  loading = false;
  error: string | null = null;
  
  onSubmit(formData: Partial<Warehouse>): void {
    this.loading = true;
    this.error = null;
    
    // Create a new warehouse with empty stocks array
    const newWarehouse: Partial<Warehouse> = {
      ...formData,
      stocks: []
    };
    
    this.warehouseService.createWarehouse(newWarehouse as Required<Warehouse>).subscribe({
      next: (createdWarehouse) => {
        this.loading = false;
        this.router.navigate(['/warehouses', createdWarehouse.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to create warehouse. Please try again.';
        console.error('Error creating warehouse:', err);
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/warehouses']);
  }
}