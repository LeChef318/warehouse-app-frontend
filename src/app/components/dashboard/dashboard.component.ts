// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeycloakService } from '../../services/auth/keycloak.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';

interface Activity {
  type: string;
  description: string;
  timestamp: Date;
}

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
  
  userInfo: UserInfo | null = null;
  loading = false;
  error: string | null = null;
  
  // Stats
  warehouseCount = 0;
  productCount = 0;
  totalStock = 0;
  
  // Activity
  activity: Activity[] = [];
  
  ngOnInit(): void {
    this.loadUserInfo();
    this.loadStats();
    this.loadActivity();
  }
  
  private loadUserInfo(): void {
    const userInfo = this.keycloakService.getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo as UserInfo;
    }
  }
  
  private loadStats(): void {
    this.loading = true;
    this.error = null;
    
    // Load warehouses
    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouseCount = warehouses.length;
        this.totalStock = warehouses.reduce((total, warehouse) => 
          total + warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0), 0);
      },
      error: (err: Error) => {
        console.error('Failed to load warehouses:', err);
        this.error = 'Failed to load warehouse statistics.';
      }
    });
    
    // Load products
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productCount = products.length;
      },
      error: (err: Error) => {
        console.error('Failed to load products:', err);
        this.error = 'Failed to load product statistics.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  loadActivity(): void {
    this.loading = true;
    this.error = null;
    
    // TODO: Implement activity loading from a service
    // For now, we'll use mock data
    this.activity = [
      {
        type: 'warehouse',
        description: 'New warehouse "Main Storage" was created',
        timestamp: new Date()
      },
      {
        type: 'product',
        description: 'Product "Widget X" stock was updated',
        timestamp: new Date(Date.now() - 3600000)
      }
    ];
    
    this.loading = false;
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'warehouse':
        return 'store';
      case 'product':
        return 'inventory_2';
      default:
        return 'event';
    }
  }
}