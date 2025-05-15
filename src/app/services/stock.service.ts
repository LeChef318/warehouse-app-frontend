import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stock, StockCreate, StockUpdate, StockTransfer } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stocks`;

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getStocksByWarehouse(warehouseId: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/warehouse/${warehouseId}`);
  }

  getStocksByProduct(productId: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/product/${productId}`);
  }

  getStockByProductAndWarehouse(productId: number, warehouseId: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/product/${productId}/warehouse/${warehouseId}`);
  }

  createStock(stock: StockCreate): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  updateStock(update: StockUpdate): Observable<Stock> {
    return this.http.put<Stock>(this.apiUrl, update);
  }

  transferStock(transfer: StockTransfer): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfer`, transfer);
  }

  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 