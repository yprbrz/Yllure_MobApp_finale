import { Platform } from 'react-native';
import type { Dress, WishlistItem, Wishlist, User, ApiResponse, DressFilters } from '@/types';

// Configure your API base URL here
const API_BASE_URL = 'https://your-solidstart-api-url.com'; // Replace with your actual API URL

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Dress API methods
  async getDresses(filters: DressFilters = {}): Promise<ApiResponse<Dress[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters.size) queryParams.append('size', filters.size);
    if (filters.available !== undefined) queryParams.append('available', filters.available.toString());
    if (filters.priceMin) queryParams.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) queryParams.append('priceMax', filters.priceMax.toString());
    if (filters.search) queryParams.append('search', filters.search);

    const endpoint = `/api/dresses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<Dress[]>(endpoint);
  }

  async getDress(id: string): Promise<ApiResponse<Dress>> {
    return this.makeRequest<Dress>(`/api/dresses/${id}`);
  }

  async getFeaturedDresses(): Promise<ApiResponse<Dress[]>> {
    return this.makeRequest<Dress[]>('/api/dresses?featured=true&available=true');
  }

  async getAvailableDresses(): Promise<ApiResponse<Dress[]>> {
    return this.makeRequest<Dress[]>('/api/dresses?available=true');
  }

  // Wishlist API methods
  async createWishlist(name: string = 'My Wishlist'): Promise<ApiResponse<Wishlist>> {
    return this.makeRequest<Wishlist>('/api/wishlists', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getWishlist(id: string): Promise<ApiResponse<Wishlist>> {
    return this.makeRequest<Wishlist>(`/api/wishlists/${id}`);
  }

  async addToWishlist(wishlistId: string, dressId: string): Promise<ApiResponse<WishlistItem>> {
    return this.makeRequest<WishlistItem>(`/api/wishlists/${wishlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ dressId }),
    });
  }

  async removeFromWishlist(wishlistId: string, dressId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/wishlists/${wishlistId}/items?dressId=${dressId}`, {
      method: 'DELETE',
    });
  }

  // Search API methods
  async searchDresses(query: string): Promise<ApiResponse<Dress[]>> {
    return this.makeRequest<Dress[]>(`/api/dresses?search=${encodeURIComponent(query)}`);
  }

  // Mock authentication methods (replace with your auth system)
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // Mock implementation - replace with your actual auth
    return {
      success: true,
      data: {
        id: '1',
        name: 'User',
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    // Mock implementation - replace with your actual auth
    return { success: true };
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    // Mock implementation - replace with your actual auth
    return { success: true, data: null };
  }
}

export const apiService = new ApiService();

// Mock data for development/testing (remove when connecting to real API)
export const mockDresses: Dress[] = [
  {
    id: '1',
    name: 'Elegant Evening Gown',
    description: 'A stunning floor-length evening gown perfect for formal occasions.',
    price: 150,
    size: 'M',
    available: true,
    frontImage: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg',
    backImage: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Cocktail Dress',
    description: 'A timeless cocktail dress suitable for semi-formal events.',
    price: 100,
    size: 'S',
    available: true,
    frontImage: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    backImage: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bohemian Maxi Dress',
    description: 'A flowing maxi dress with bohemian flair.',
    price: 80,
    size: 'L',
    available: false,
    frontImage: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg',
    backImage: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];