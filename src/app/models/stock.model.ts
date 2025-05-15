export interface Stock {
  id: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
}

export interface StockCreate {
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface StockUpdate {
  productId: number;
  warehouseId: number;
  quantity: number;
  operation: 'ADD' | 'REMOVE';
}

export interface StockTransfer {
  productId: number;
  sourceWarehouseId: number;
  targetWarehouseId: number;
  quantity: number;
} 