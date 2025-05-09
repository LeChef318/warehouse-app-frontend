import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { WarehouseService } from '../../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, WarehouseFormComponent],
  template: `
    <div class="warehouse-edit-container">
      <div class="page-header">
        <button class="back-button" [routerLink]="['/warehouses', warehouseId]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back to Warehouse Details
        </button>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
      
      <app-warehouse-form 
        *ngIf="warehouseId && !error"
        mode="edit" 
        [warehouseId]="warehouseId">
      </app-warehouse-form>
    </div>
  `,
  styles: [`
    @import '../../../../styles/variables';
    
    .warehouse-edit-container {
      width: 100%;
      max-width: 100%;
    }
    
    .page-header {
      margin-bottom: 1.5rem;
    }
    
    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: $primary-color;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
      
      svg {
        color: $primary-color;
      }
    }
    
    .error-message {
      background-color: #ffebee;
      color: #e53935;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
    }
  `]
})
export class WarehouseEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  warehouseId: number | null = null;
  error: string | null = null;
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.warehouseId = Number(id);
      } else {
        this.error = 'Warehouse ID not provided';
        setTimeout(() => {
          this.router.navigate(['/warehouses']);
        }, 3000);
      }
    });
  }
}