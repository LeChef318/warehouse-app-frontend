export interface Stock {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
  }
  
  export interface Warehouse {
    id: string;
    name: string;
    location: string;
    stocks: Stock[];
    products?: {
      id: string;
      name: string;
      quantity: number;
    }[];
  }

  export interface WarehouseFormData {
    name: string;
    location: string;
  }