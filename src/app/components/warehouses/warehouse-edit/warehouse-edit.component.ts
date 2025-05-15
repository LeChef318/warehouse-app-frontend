// src/app/components/warehouses/warehouse-edit/warehouse-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { WarehouseService } from '../../../services/warehouse.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { Warehouse } from '../../../models/warehouse.model';
import { WarehouseFormData } from '../../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    WarehouseFormComponent
  ],
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.scss']
})
export class WarehouseEditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  
  warehouse: Warehouse | null = null;
  loadingWarehouse = true;
  submitting = false;
  error: string | null = null;
  
  constructor() {
    if (!this.keycloakService.isManager()) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to edit warehouses.' }
      });
    }
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/warehouses']);
      return;
    }
    
    this.loadingWarehouse = true;
    this.warehouseService.getWarehouse(Number(id)).subscribe({
      next: (warehouse) => {
        this.warehouse = warehouse;
        this.loadingWarehouse = false;
      },
      error: () => {
        this.error = 'Failed to load warehouse. Please try again.';
        this.loadingWarehouse = false;
      }
    });
  }
  
  onSubmit(formData: WarehouseFormData): void {
    if (!this.warehouse) return;
    
    this.submitting = true;
    this.error = null;
    
    this.warehouseService.updateWarehouse(Number(this.warehouse.id), formData).subscribe({
      next: (warehouse) => {
        this.submitting = false;
        this.router.navigate(['/warehouses', warehouse.id]);
      },
      error: () => {
        this.error = 'Failed to update warehouse. Please try again.';
        this.submitting = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/warehouses', this.warehouse?.id]);
  }
}