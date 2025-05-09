import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})

export class WarehouseListComponent implements OnInit {
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);
  isManager = false;
  private route = inject(ActivatedRoute);
  
  warehouses: Warehouse[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = null;
    
    // Use the real API endpoint
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  getProductCount(warehouse: Warehouse): number {
    return warehouse.stocks.length;
  }

  getTotalQuantity(warehouse: Warehouse): number {
    return warehouse.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }
}