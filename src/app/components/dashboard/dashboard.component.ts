// src/app/components/dashboard/dashboard.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../services/auth/keycloak.service';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private keycloakService = inject(KeycloakService);
  private warehouseService = inject(WarehouseService);
  
  userInfo: any = null;
  warehouses: Warehouse[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  totalProductTypes: number = 0;
  totalWarehouses: number = 0;
  totalItems: number = 0;

  ngOnInit(): void {
    this.userInfo = this.keycloakService.getUserInfo();
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = null;
    
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.calculateStatistics();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalWarehouses = this.warehouses.length;
    
    if (this.totalWarehouses === 0) {
      this.totalProductTypes = 0;
      this.totalItems = 0;
      return;
    }
    
    // Count unique products across all warehouses
    const uniqueProductIds = new Set<number>();
    let itemCount = 0;
    
    this.warehouses.forEach(warehouse => {
      warehouse.stocks.forEach(stock => {
        uniqueProductIds.add(stock.productId);
        itemCount += stock.quantity;
      });
    });
    
    this.totalProductTypes = uniqueProductIds.size;
    this.totalItems = itemCount;
  }

  getProductCount(warehouse: Warehouse): number {
    return warehouse.stocks.length;
  }

  getTotalQuantity(warehouse: Warehouse): number {
    return warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
}