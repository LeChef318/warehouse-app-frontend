// src/app/services/warehouse.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Warehouse, WarehouseFormData } from '../models/warehouse.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/warehouses`;

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching warehouses', error);
          return throwError(() => new Error('Failed to load warehouses. Please try again later.'));
        })
      );
  }

  getWarehouse(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching warehouse with id ${id}`, error);
          return throwError(() => new Error('Failed to load warehouse details. Please try again later.'));
        })
      );
  }

  createWarehouse(data: WarehouseFormData): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, data)
      .pipe(
        catchError(error => {
          console.error('Error creating warehouse', error);
          return throwError(() => new Error('Failed to create warehouse. Please try again later.'));
        })
      );
  }

  updateWarehouse(id: number, data: WarehouseFormData): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, data)
      .pipe(
        catchError(error => {
          console.error(`Error updating warehouse with id ${id}`, error);
          return throwError(() => new Error('Failed to update warehouse. Please try again later.'));
        })
      );
  }

  addStock(warehouseId: number, productId: number, quantity: number): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${environment.apiUrl}/stocks`, {
      warehouseId,
      productId,
      quantity
    }).pipe(
      catchError(error => {
        console.error(`Error adding stock to warehouse ${warehouseId}`, error);
        return throwError(() => new Error('Failed to add stock. Please try again later.'));
      })
    );
  }

  updateStock(warehouseId: number, productId: number, quantity: number, operation: 'ADD' | 'REMOVE'): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${environment.apiUrl}/stocks`, {
      warehouseId,
      productId,
      quantity,
      operation
    }).pipe(
      catchError(error => {
        console.error(`Error updating stock in warehouse ${warehouseId}`, error);
        return throwError(() => new Error('Failed to update stock. Please try again later.'));
      })
    );
  }
}