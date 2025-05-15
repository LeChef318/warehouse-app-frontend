// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeycloakService } from '../../services/auth/keycloak.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ProductService } from '../../services/product.service';
import { Warehouse } from '../../models/warehouse.model';

interface UserInfo {
  name?: string;
  email?: string;
  preferred_username?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private keycloakService = inject(KeycloakService);
  private warehouseService = inject(WarehouseService);
  private productService = inject(ProductService);
  private router = inject(Router);
  
  userInfo: UserInfo | null = null;
  loading = false;
  error: string | null = null;
  
  // Stats
  warehouseCount = 0;
  productCount = 0;
  totalStock = 0;
  warehouses: Warehouse[] = [];
  isManager = false;
  
  ngOnInit(): void {
    this.loadUserInfo();
    this.loadWarehouses();
  }
  
  private loadUserInfo(): void {
    this.userInfo = this.keycloakService.getUserInfo() as UserInfo;
    this.isManager = this.keycloakService.getUserRoles().includes('manager');
  }
  
  loadWarehouses(): void {
    this.loading = true;
    this.error = null;
    
    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.warehouseCount = warehouses.length;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load warehouses. Please try again.';
        this.loading = false;
      }
    });
  }
  
  private calculateStats(): void {
    this.productCount = this.warehouses.reduce((total, warehouse) => 
      total + warehouse.stocks.length, 0);
    
    this.totalStock = this.warehouses.reduce((total, warehouse) => 
      total + warehouse.stocks.reduce((sum: number, stock) => 
        sum + stock.quantity, 0), 0);
  }

  getProductCount(warehouse: Warehouse): number {
    return warehouse.stocks.length;
  }

  getTotalQuantity(warehouse: Warehouse): number {
    return warehouse.stocks.reduce((sum: number, stock) => 
      sum + stock.quantity, 0);
  }

  viewWarehouse(id: string) {
    this.router.navigate(['/warehouses', id]);
  }

  createWarehouse() {
    this.router.navigate(['/warehouses/new']);
  }
}