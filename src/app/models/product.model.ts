// src/app/models/product.model.ts
export interface ProductStock {
    id: number;
    warehouseId: number;
    warehouseName: string;
    quantity: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    categoryName: string;
    stocks: ProductStock[];
  }