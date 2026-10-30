export interface Product {
  id: string;
  name: string;
  category: 'Staples & Grains' | 'Cooking Oils & Ghee' | 'Tea & Beverages' | 'Dairy & Bakery' | 'Snacks & Biscuits' | 'Spices & Sauces' | 'Personal & Household';
  price: number;
  originalPrice: number;
  discountPercent?: number;
  unit: string;
  image: string;
  barcode: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  badge?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customPrice?: number;
}

export interface StoreSettings {
  storeName: string;
  shortCode: string;
  location: string;
  houseAddress: string;
  phone: string;
  alternatePhone?: string;
  currency: string;
  slideshowInterval: number; // in seconds
  marqueeText: string;
  cashierName: string;
  taxRate: number; // percentage, e.g. 0%
  theme: 'dark' | 'light';
}

export type DisplayMode = 'billboard' | 'receipt' | 'split';

export interface CompletedSale {
  id: string;
  billNumber: string;
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  changeDue: number;
  paymentMethod: 'Cash' | 'Card' | 'EasyPaisa' | 'JazzCash';
  customerName?: string;
  customerPhone?: string;
}
