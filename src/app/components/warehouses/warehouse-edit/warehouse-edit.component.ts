// src/app/components/warehouses/warehouse-edit/warehouse-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    WarehouseFormComponent
  ],
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.scss']
})
export class WarehouseEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  
  warehouse: Warehouse | null = null;
  loading = false;
  loadingWarehouse = true;
  error: string | null = null;
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const warehouseId = params.get('id');
      if (warehouseId) {
        this.loadWarehouse(Number(warehouseId));
      } else {
        this.error = 'Warehouse ID not provided';
        this.loadingWarehouse = false;
      }
    });
  }
  
  loadWarehouse(id: number): void {
    this.loadingWarehouse = true;
    this.error = null;
    
    this.warehouseService.getWarehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;
        this.loadingWarehouse = false;
      },
      error: (err) => {
        console.error(`Error loading warehouse with ID ${id}:`, err);
        this.error = 'Failed to load warehouse details. Please try again later.';
        this.loadingWarehouse = false;
      }
    });
  }
  
  onSubmit(formData: Partial<Warehouse>): void {
    if (!this.warehouse) return;
    
    this.loading = true;
    this.error = null;
    
    // Preserve the stocks array from the original warehouse
    const updatedWarehouse: Partial<Warehouse> = {
      ...formData,
      id: this.warehouse.id,
      stocks: this.warehouse.stocks
    };
    
    this.warehouseService.updateWarehouse(this.warehouse.id, updatedWarehouse as Required<Warehouse>).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/warehouses', this.warehouse?.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to update warehouse. Please try again.';
        console.error('Error updating warehouse:', err);
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/warehouses', this.warehouse?.id]);
  }
}