export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}