
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Waks Signature Candle',
    description: 'Our flagship soy-based candle with hints of sandalwood and bergamot. Hand-poured in small batches for the ultimate clean burn.',
    price: 45,
    category: 'Home Decor',
    images: ['https://picsum.photos/seed/candle/800/800'],
    stock: 50,
    sku: 'WKS-SND-01',
    rating: 4.8,
    reviews: [],
    specs: { 'Material': 'Soy Wax', 'Burn Time': '60 hours', 'Weight': '12oz' },
    isFeatured: true
  },
  {
    id: '2',
    name: 'Velvet Lounge Chair',
    description: 'Elegant Scandinavian design with premium velvet upholstery and solid oak legs. Perfect for modern living spaces.',
    price: 899,
    category: 'Furniture',
    images: ['https://picsum.photos/seed/chair/800/800'],
    stock: 12,
    sku: 'WKS-FUR-02',
    rating: 4.9,
    reviews: [],
    specs: { 'Material': 'Velvet, Oak', 'Dimensions': '75cm x 80cm x 90cm' },
    isFeatured: true
  },
  {
    id: '3',
    name: 'Ceramic Pour-Over Set',
    description: 'The connoisseur\'s choice for morning coffee. Minimalist white ceramic finish with precise drip flow.',
    price: 65,
    category: 'Kitchen',
    images: ['https://picsum.photos/seed/coffee/800/800'],
    stock: 25,
    sku: 'WKS-KIT-03',
    rating: 4.5,
    reviews: [],
    specs: { 'Material': 'Ceramic', 'Capacity': '500ml' }
  },
  {
    id: '4',
    name: 'Heavyweight Linen Duvet',
    description: 'European flax linen for year-round comfort. Breathable, durable, and gets softer with every wash.',
    price: 220,
    category: 'Bedding',
    images: ['https://picsum.photos/seed/bed/800/800'],
    stock: 8,
    sku: 'WKS-BD-04',
    rating: 4.7,
    reviews: [],
    specs: { 'Material': '100% Linen', 'Size': 'Queen' }
  }
];

export const CATEGORIES = ['All', 'Home Decor', 'Furniture', 'Kitchen', 'Bedding'];
