import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';

@Component({
  selector: 'app-warehouse-create',
  standalone: true,
  imports: [CommonModule, RouterModule, WarehouseFormComponent],
  template: `
    <div class="warehouse-create-container">
      <div class="page-header">
        <button class="back-button" routerLink="/warehouses">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back to Warehouses
        </button>
      </div>
      
      <app-warehouse-form mode="create"></app-warehouse-form>
    </div>
  `,
  styles: [`
    @import '../../../../styles/variables';
    
    .warehouse-create-container {
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
  `]
})
export class WarehouseCreateComponent {}