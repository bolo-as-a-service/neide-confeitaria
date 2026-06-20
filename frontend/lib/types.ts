export interface BackendCategory {
  id: number;
  name: string;
}

export interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  category?: BackendCategory;
  ingredients?: string[];
}

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface BackendOrderItem {
  id: number;
  product: BackendProduct;
  quantity: number;
  observation?: string;
  unitPrice: number;
}

export interface BackendOrder {
  id: number;
  customerName: string;
  phone: string;
  delivery: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  observation?: string;
  status: string;
  deliveryDateTime?: string;
  createdAt?: string;
  items: BackendOrderItem[];
}

export interface BackendOrderDTO {
  customerName: string;
  phone: string;
  delivery: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  deliveryDateTime?: string;
  observation?: string;
  items: { productId: number; quantity: number; observation?: string }[];
}

export interface BackendLoginDTO {
  email: string;
  password: string;
}

export interface BackendRegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}
