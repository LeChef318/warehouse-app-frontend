// src/app/services/warehouse.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Warehouse } from '../models/warehouse.model';
import { environment } from '../../evironments/environment';

export interface WarehouseFormData {
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = `${environment.apiUrl}/warehouses`;

  constructor(private http: HttpClient) { }

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
}