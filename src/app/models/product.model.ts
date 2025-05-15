import { Stock } from './stock.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  stocks: Stock[];
}