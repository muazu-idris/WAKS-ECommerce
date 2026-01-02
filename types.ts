
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  reviews: Review[];
  specs: Record<string, string>;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid';
  date: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'manager';
  orders: string[];
  wishlist: string[];
}

export enum ThemeColor {
  Primary = 'indigo',
  Secondary = 'slate'
}
