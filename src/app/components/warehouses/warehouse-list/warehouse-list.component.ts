// src/app/components/warehouses/warehouse-list/warehouse-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WarehouseService } from '../../../services/warehouse.service';
import { KeycloakService } from '../../../services/auth/keycloak.service';
import { Warehouse } from '../../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent implements OnInit {
  private warehouseService = inject(WarehouseService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);

  warehouses: Warehouse[] = [];
  loading = true;
  error: string | null = null;
  isManager = false;

  displayedColumns: string[] = ['name', 'location', 'stockCount', 'actions'];

  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = null;

    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading warehouses:', err);
        this.error = 'Failed to load warehouses. Please try again later.';
        this.loading = false;
      }
    });
  }

  createWarehouse(): void {
    if (this.isManager) {
      this.router.navigate(['/warehouses/create']);
    } else {
      this.router.navigate(['/access-denied'], {
        queryParams: { message: 'You need manager permissions to create warehouses.' }
      });
    }
  }

  viewWarehouseDetails(id: number): void {
    this.router.navigate(['/warehouses', id]);
  }

  getStockCount(warehouse: Warehouse): number {
    return warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }

  getProductCount(warehouse: Warehouse): number {
    return warehouse.stocks.length;
  }

  getTotalQuantity(warehouse: Warehouse): number {
    return warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
}