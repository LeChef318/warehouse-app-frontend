import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseFormData, WarehouseService } from '../../../services/warehouse.service';
import { Warehouse } from '../../../models/warehouse.model';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../services/auth/keycloak.service';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private warehouseService = inject(WarehouseService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);
  isManager = false;
  
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() warehouseId: number | null = null;
  @Input() initialData: Partial<WarehouseFormData> | null = null;
  @Output() formSubmitted = new EventEmitter<Warehouse>();
  
  warehouseForm!: FormGroup;
  loading = false;
  error: string | null = null;
  submitted = false;
  
  ngOnInit(): void {
    this.isManager = this.keycloakService.isManager();
    
    if (!this.isManager) {
      const message = 'You need manager permissions to perform this action.';
      this.router.navigateByUrl('/access-denied', { 
        state: { message }
      });
      return;
    }
    
    this.initForm();
    
    if (this.mode === 'edit' && this.warehouseId && !this.initialData) {
      this.loadWarehouse(this.warehouseId);
    }
  }
  
  initForm(): void {
    this.warehouseForm = this.fb.group({
      name: [this.initialData?.name || '', [Validators.required]],
      location: [this.initialData?.location || '', [Validators.required]]
    });
  }
  
  loadWarehouse(id: number): void {
    this.loading = true;
    this.warehouseService.getWarehouse(id).subscribe({
      next: (warehouse) => {
        this.warehouseForm.patchValue({
          name: warehouse.name,
          location: warehouse.location
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load warehouse data. Please try again.';
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.warehouseForm.invalid) {
      return;
    }
    
    const formData: WarehouseFormData = this.warehouseForm.value;
    this.loading = true;
    this.error = null;
    
    if (this.mode === 'create') {
      this.warehouseService.createWarehouse(formData).subscribe({
        next: (warehouse) => {
          this.loading = false;
          this.formSubmitted.emit(warehouse);
          this.router.navigate(['/warehouses', warehouse.id]);
        },
        error: (err) => {
          this.error = 'Failed to create warehouse. Please try again.';
          this.loading = false;
        }
      });
    } else if (this.mode === 'edit' && this.warehouseId) {
      this.warehouseService.updateWarehouse(this.warehouseId, formData).subscribe({
        next: (warehouse) => {
          this.loading = false;
          this.formSubmitted.emit(warehouse);
          this.router.navigate(['/warehouses', warehouse.id]);
        },
        error: (err) => {
          this.error = 'Failed to update warehouse. Please try again.';
          this.loading = false;
        }
      });
    }
  }
  
  cancel(): void {
    if (this.mode === 'edit' && this.warehouseId) {
      this.router.navigate(['/warehouses', this.warehouseId]);
    } else {
      this.router.navigate(['/warehouses']);
    }
  }
  
  // Helper methods for form validation
  get nameControl() { return this.warehouseForm.get('name'); }
  get locationControl() { return this.warehouseForm.get('location'); }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.warehouseForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched || this.submitted));
  }
}