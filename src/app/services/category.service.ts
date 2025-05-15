// src/app/services/category.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

export type { Category } from '../models/category.model';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories', error);
          return throwError(() => new Error('Failed to load categories. Please try again later.'));
        })
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/category/${categoryId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching products for category ${categoryId}`, error);
          return throwError(() => new Error('Failed to load products. Please try again later.'));
        })
      );
  }
}