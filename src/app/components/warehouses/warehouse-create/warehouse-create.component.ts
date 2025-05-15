// src/app/components/warehouses/warehouse-create/warehouse-create.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { WarehouseService } from '../../../services/warehouse.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { WarehouseFormData } from '../../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    WarehouseFormComponent
  ],
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.scss']
})
export class WarehouseCreateComponent {
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  
  loading = false;
  error: string | null = null;
  
  constructor() {
    if (!this.keycloakService.isManager()) {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create warehouses.' }
      });
    }
  }
  
  onSubmit(formData: WarehouseFormData): void {
    this.loading = true;
    this.error = null;
    
    this.warehouseService.createWarehouse(formData).subscribe({
      next: (warehouse) => {
        this.loading = false;
        this.router.navigate(['/warehouses', warehouse.id]);
      },
      error: () => {
        this.error = 'Failed to create warehouse. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/warehouses']);
  }
}