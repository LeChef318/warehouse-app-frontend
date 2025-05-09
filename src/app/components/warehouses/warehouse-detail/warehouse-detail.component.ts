import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse.service';
import { Warehouse, Stock } from '../../../models/warehouse.model';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private warehouseService = inject(WarehouseService);
  private keycloakService = inject(KeycloakService);
  isManager = false;
  
  warehouse: Warehouse | null = null;
  loading: boolean = true;
  error: string | null = null;
  
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
}