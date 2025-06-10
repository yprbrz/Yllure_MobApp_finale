export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Dress {
  id: string;
  name: string;
  description: string;
  price: number;
  size: Size;
  available: boolean;
  frontImage: string | any; // Can be URL string or require() result
  backImage: string | any;  // Can be URL string or require() result
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  dressId: string;
  createdAt: string;
  dress: Dress;
}

export interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  message?: string;
}

export interface DressFilters {
  size?: Size;
  available?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface WishlistState {
  wishlistItems: Dress[];
  isLoading: boolean;
}

export interface DressState {
  dresses: Dress[];
  featuredDresses: Dress[];
  filteredDresses: Dress[];
  isLoading: boolean;
}