export interface Stock {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
  }
  
  export interface Warehouse {
    id: number;
    name: string;
    location: string;
    stocks: Stock[];
  }

  export interface WarehouseFormData {
    name: string;
    location: string;
  }