import { Platform } from 'react-native';
import type { Dress, WishlistItem, Wishlist, User, ApiResponse, DressFilters, Size } from '@/types';

// API Configuration - Update with your computer's IP address
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000'; // Replace with your IP
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

// Use mock data in development if API is not available
const USE_MOCK_DATA = false; // Set to false when your API is working
const FORCE_MOCK_DATA = false; // Set to true to always use mock data regardless of API status

// Helper function to resolve image URLs
const resolveImageUrl = (imagePath: string): string => {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, convert to full URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Fallback to a placeholder if path is invalid
  return 'https://via.placeholder.com/300x400/E0E0E0/999999?text=No+Image';
};

// Helper function to process dress data and fix image URLs
const processDressData = (dress: any): Dress => ({
  ...dress,
  frontImage: resolveImageUrl(dress.frontImage),
  backImage: resolveImageUrl(dress.backImage),
});
const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return '/api'; // For web version
  }
  return `${API_BASE_URL}/api`; // For mobile app
};

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // If forcing mock data, handle it here
    if (USE_MOCK_DATA || FORCE_MOCK_DATA) {
      console.log('🔧 Using mock data (forced)');
      return this.handleMockRequest<T>(endpoint, options);
    }

    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}${endpoint}`;
      
      console.log(`🌐 Making API request to: ${url}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      // Clear timeout if request completes
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response successful:', data);
      
      // Process dress data to fix image URLs if it's dress-related endpoint
      if (endpoint.includes('/dresses') && data.success && data.data) {
        if (Array.isArray(data.data)) {
          // Multiple dresses
          data.data = data.data.map(processDressData);
        } else if (data.data.frontImage) {
          // Single dress
          data.data = processDressData(data.data);
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      console.error('📍 Failed URL:', `${getBaseUrl()}${endpoint}`);
      
      // Fallback to mock data if API fails
      console.log('🔄 Falling back to mock data...');
      return this.handleMockRequest<T>(endpoint, options);
    }
  }

  // Mock data handler for development
  private async handleMockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    console.log(`Mock API request: ${options.method || 'GET'} ${endpoint}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (endpoint.startsWith('/dresses')) {
      if (endpoint.includes('/dresses/')) {
        // Single dress request
        const id = endpoint.split('/').pop();
        const dress = mockDresses.find(d => d.id === id);
        return {
          success: true,
          data: dress as T,
        };
      } else {
        // All dresses request - parse query parameters safely
        let filtered = mockDresses;
        
        // Parse query parameters from endpoint
        try {
          const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
          const params = new URLSearchParams(queryString);
          
          const available = params.get('available');
          const size = params.get('size');
          
          if (available !== null) {
            filtered = filtered.filter(d => d.available === (available === 'true'));
          }
          
          if (size) {
            filtered = filtered.filter(d => d.size === size);
          }
        } catch (parseError) {
          console.log('⚠️ Mock - Error parsing query params, using all dresses');
        }
        
        return {
          success: true,
          data: filtered as T,
          count: filtered.length,
        };
      }
    }

    if (endpoint.startsWith('/wishlists')) {
      if (options.method === 'POST') {
        // Create wishlist
        const newWishlist: Wishlist = {
          id: Date.now().toString(),
          name: 'My Wishlist',
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          success: true,
          data: newWishlist as T,
        };
      } else {
        // Get wishlist
        const mockWishlist: Wishlist = {
          id: '1',
          name: 'My Wishlist',
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          success: true,
          data: mockWishlist as T,
        };
      }
    }

    return {
      success: false,
      error: 'Mock endpoint not implemented',
    };
  }

  // Dress API methods
  async getDresses(filters: DressFilters = {}): Promise<ApiResponse<Dress[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters.size) queryParams.append('size', filters.size);
    if (filters.available !== undefined) queryParams.append('available', filters.available.toString());

    const endpoint = `/dresses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('📡 Calling getDresses with endpoint:', endpoint);
    const response = await this.makeRequest<Dress[]>(endpoint);
    console.log('📦 getDresses response:', JSON.stringify(response, null, 2));
    
    return response;
  }

  async getDress(id: string): Promise<ApiResponse<Dress>> {
    return this.makeRequest<Dress>(`/dresses/${id}`);
  }

  async getFeaturedDresses(): Promise<ApiResponse<Dress[]>> {
    try {
      const response = await this.getDresses({ available: true });
      console.log('🔍 getDresses response for featured:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const featuredDresses = response.data.filter(dress => dress.featured);
        console.log('✨ Featured dresses found:', featuredDresses.length);
        return {
          success: true,
          data: featuredDresses,
          count: featuredDresses.length,
        };
      }
      
      // If data is undefined or not an array, return empty array
      console.log('⚠️ No data or invalid data format, returning empty array');
      return {
        success: true,
        data: [],
        count: 0,
        message: 'No featured dresses available'
      };
    } catch (error) {
      console.error('❌ Error in getFeaturedDresses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch featured dresses',
        data: []
      };
    }
  }

  async getAvailableDresses(): Promise<ApiResponse<Dress[]>> {
    return this.getDresses({ available: true });
  }

  // Wishlist API methods
  async createWishlist(name: string = 'My Wishlist'): Promise<ApiResponse<Wishlist>> {
    return this.makeRequest<Wishlist>('/wishlists', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getWishlist(id: string): Promise<ApiResponse<Wishlist>> {
    return this.makeRequest<Wishlist>(`/wishlists/${id}`);
  }

  async addToWishlist(wishlistId: string, dressId: string): Promise<ApiResponse<WishlistItem>> {
    return this.makeRequest<WishlistItem>(`/wishlists/${wishlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ dressId }),
    });
  }

  async removeFromWishlist(wishlistId: string, dressId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/wishlists/${wishlistId}/items?dressId=${dressId}`, {
      method: 'DELETE',
    });
  }

  // Search methods
  async searchDresses(query: string, filters: DressFilters = {}): Promise<ApiResponse<Dress[]>> {
    try {
      const response = await this.getDresses(filters);
      console.log('🔍 Search - getDresses response:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const filteredDresses = response.data.filter(dress => 
          dress.name.toLowerCase().includes(query.toLowerCase()) ||
          dress.description.toLowerCase().includes(query.toLowerCase())
        );
        return {
          success: true,
          data: filteredDresses,
          count: filteredDresses.length,
        };
      }
      
      // If data is undefined or not an array, return empty array
      return {
        success: true,
        data: [],
        count: 0,
        message: 'No dresses found for search'
      };
    } catch (error) {
      console.error('❌ Error in searchDresses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search dresses',
        data: []
      };
    }
  }

  // Authentication methods (mock for now)
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return {
      success: true,
      data: {
        id: '1',
        name: 'Demo User',
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    return { success: true };
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return { 
      success: true, 
      data: {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    };
  }

  // Utility methods
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.getDresses();
      return response.success;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Toggle between mock and real API
  setUseMockData(useMock: boolean) {
    // This would typically modify a class property, but since USE_MOCK_DATA is const,
    // you'd need to modify the constant at the top of the file
    console.log(`Mock data ${useMock ? 'enabled' : 'disabled'}`);
  }
}

export const apiService = new ApiService();

// Mock data with placeholder URLs (no local files needed)
export const mockDresses: Dress[] = [
  {
    id: '1',
    name: 'Elegant Evening Gown',
    description: 'A stunning evening gown perfect for formal occasions. Features intricate beadwork and a flowing silhouette.',
    price: 89.99,
    size: 'M' as Size,
    available: true,
    featured: true,
    frontImage: 'https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Dress+1',
    backImage: 'https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Dress+1+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cocktail Dress',
    description: 'A chic cocktail dress ideal for semi-formal events. Perfect balance of elegance and comfort.',
    price: 69.99,
    size: 'L' as Size,
    available: true,
    featured: true,
    frontImage: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Dress+2',
    backImage: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Dress+2+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Summer Maxi Dress',
    description: 'A flowing maxi dress perfect for summer occasions. Light fabric with beautiful floral patterns.',
    price: 59.99,
    size: 'S' as Size,
    available: true,
    featured: true,
    frontImage: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=Dress+3',
    backImage: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=Dress+3+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Business Attire',
    description: 'Professional business attire for corporate settings. Sophisticated design with modern cut.',
    price: 79.99,
    size: 'M' as Size,
    available: true,
    featured: false,
    frontImage: 'https://via.placeholder.com/300x400/607D8B/FFFFFF?text=Dress+4',
    backImage: 'https://via.placeholder.com/300x400/607D8B/FFFFFF?text=Dress+4+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Wedding Guest Dress',
    description: 'An elegant dress perfect for attending weddings. Timeless design that photographs beautifully.',
    price: 99.99,
    size: 'L' as Size,
    available: true,
    featured: false,
    frontImage: 'https://via.placeholder.com/300x400/795548/FFFFFF?text=Dress+5',
    backImage: 'https://via.placeholder.com/300x400/795548/FFFFFF?text=Dress+5+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Party Dress',
    description: 'A fun and flirty dress for parties and celebrations. Eye-catching design with comfortable fit.',
    price: 74.99,
    size: 'XS' as Size,
    available: true,
    featured: false,
    frontImage: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=Dress+6',
    backImage: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=Dress+6+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Casual Day Dress',
    description: 'A comfortable dress for casual day events. Versatile design suitable for various occasions.',
    price: 49.99,
    size: 'XL' as Size,
    available: true,
    featured: false,
    frontImage: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Dress+7',
    backImage: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Dress+7+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Vintage-Inspired Dress',
    description: 'A dress with vintage charm and modern comfort. Classic silhouette with contemporary touches.',
    price: 84.99,
    size: 'XXL' as Size,
    available: false,
    featured: false,
    frontImage: 'https://via.placeholder.com/300x400/9E9E9E/FFFFFF?text=Dress+8',
    backImage: 'https://via.placeholder.com/300x400/9E9E9E/FFFFFF?text=Dress+8+Back',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Export additional utilities
export { getBaseUrl };
export type { DressFilters };