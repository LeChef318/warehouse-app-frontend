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
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';

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
    MatChipsModule
  ],
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  
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
        this.loadWarehouse(Number(warehouseId));
      } else {
        this.error = 'Warehouse ID not provided';
        this.loading = false;
      }
    });
  }
  
  loadWarehouse(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.warehouseService.getWarehouse(id).subscribe({
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
}