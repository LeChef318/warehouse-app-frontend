// src/app/components/warehouses/warehouse-form/warehouse-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Warehouse } from '../../../models/warehouse.model';
import { WarehouseFormData } from '../../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent implements OnInit {
  @Input() warehouse: Warehouse | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() submitButtonText = 'Save';
  @Input() title = 'Warehouse Form';
  
  @Output() formSubmit = new EventEmitter<WarehouseFormData>();
  @Output() cancelRequest = new EventEmitter<void>();
  
  warehouseForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.warehouseForm = this.fb.group({
      name: [this.warehouse?.name || '', [Validators.required, Validators.maxLength(100)]],
      location: [this.warehouse?.location || '', [Validators.required, Validators.maxLength(200)]]
    });
  }
  
  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      this.markFormGroupTouched(this.warehouseForm);
      return;
    }
    
    const formData: WarehouseFormData = this.warehouseForm.value;
    this.formSubmit.emit(formData);
  }
  
  onCancel(): void {
    this.cancelRequest.emit();
  }
  
  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  // Form validation helpers
  hasError(controlName: string, errorName: string): boolean {
    const control = this.warehouseForm.get(controlName);
    return !!control && control.hasError(errorName) && control.touched;
  }
}