import { create } from 'zustand';
import { apiService } from '@/services/api';
import type { Dress, DressFilters, DressState } from '@/types';

interface DressStore extends DressState {
  fetchDresses: () => Promise<void>;
  fetchFeaturedDresses: () => Promise<void>;
  fetchDress: (id: string) => Promise<Dress | null>;
  searchDresses: (query: string) => Promise<void>;
  applyFilters: (filters: DressFilters) => void;
  resetFilters: () => void;
}

export const useDressStore = create<DressStore>((set, get) => ({
  // Initialize all arrays as empty arrays to prevent undefined errors
  dresses: [],
  featuredDresses: [],
  filteredDresses: [],
  isLoading: false,

  fetchDresses: async () => {
    set({ isLoading: true });
    try {
      console.log('🏪 Store - Fetching dresses...');
      const response = await apiService.getDresses();
      console.log('🏪 Store - getDresses response:', response);
      
      if (response.success && response.data) {
        // Ensure data is an array
        const dresses = Array.isArray(response.data) ? response.data : [];
        console.log('✅ Store - Setting dresses:', dresses.length);
        set({ 
          dresses,
          filteredDresses: dresses, // Initialize filteredDresses with all dresses
          isLoading: false 
        });
      } else {
        console.log('⚠️ Store - No dresses data received');
        set({ 
          dresses: [],
          filteredDresses: [],
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('❌ Store - Failed to fetch dresses:', error);
      set({ 
        dresses: [],
        filteredDresses: [],
        isLoading: false 
      });
    }
  },

  fetchFeaturedDresses: async () => {
    set({ isLoading: true });
    try {
      console.log('✨ Store - Fetching featured dresses...');
      const response = await apiService.getFeaturedDresses();
      console.log('✨ Store - getFeaturedDresses response:', response);
      
      if (response.success && response.data) {
        // Ensure data is an array
        const featuredDresses = Array.isArray(response.data) ? response.data : [];
        console.log('✅ Store - Setting featured dresses:', featuredDresses.length);
        set({ 
          featuredDresses,
          isLoading: false 
        });
      } else {
        console.log('⚠️ Store - No featured dresses data received');
        set({ 
          featuredDresses: [],
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('❌ Store - Failed to fetch featured dresses:', error);
      set({ 
        featuredDresses: [],
        isLoading: false 
      });
    }
  },

  fetchDress: async (id: string) => {
    try {
      console.log(`👗 Store - Fetching dress with id: ${id}`);
      const response = await apiService.getDress(id);
      console.log('👗 Store - getDress response:', response);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        console.log('⚠️ Store - No dress data received for id:', id);
        return null;
      }
    } catch (error) {
      console.error('❌ Store - Failed to fetch dress:', error);
      return null;
    }
  },

  searchDresses: async (query: string) => {
    set({ isLoading: true });
    try {
      console.log(`🔍 Store - Searching dresses with query: "${query}"`);
      const response = await apiService.searchDresses(query);
      console.log('🔍 Store - searchDresses response:', response);
      
      if (response.success && response.data) {
        // Ensure data is an array
        const searchResults = Array.isArray(response.data) ? response.data : [];
        set({ 
          filteredDresses: searchResults,
          isLoading: false 
        });
      } else {
        console.log('⚠️ Store - No search results received');
        set({ 
          filteredDresses: [],
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('❌ Store - Failed to search dresses:', error);
      set({ 
        filteredDresses: [],
        isLoading: false 
      });
    }
  },

  applyFilters: (filters: DressFilters) => {
    const { dresses } = get();
    console.log('🔧 Store - Applying filters:', filters);
    console.log('🔧 Store - Current dresses count:', dresses?.length || 0);
    
    // Ensure dresses is an array before filtering
    if (!Array.isArray(dresses) || dresses.length === 0) {
      console.log('⚠️ Store - No dresses to filter');
      set({ filteredDresses: [] });
      return;
    }

    let filtered = [...dresses];

    // Filter by size
    if (filters.size) {
      filtered = filtered.filter(dress => dress.size === filters.size);
      console.log(`🔧 Store - After size filter (${filters.size}):`, filtered.length);
    }

    // Filter by availability
    if (filters.available !== undefined) {
      filtered = filtered.filter(dress => dress.available === filters.available);
      console.log(`🔧 Store - After availability filter (${filters.available}):`, filtered.length);
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(dress => dress.price >= filters.priceMin!);
      console.log(`🔧 Store - After min price filter (${filters.priceMin}):`, filtered.length);
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(dress => dress.price <= filters.priceMax!);
      console.log(`🔧 Store - After max price filter (${filters.priceMax}):`, filtered.length);
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(dress =>
        dress.name.toLowerCase().includes(query) ||
        dress.description.toLowerCase().includes(query)
      );
      console.log(`🔧 Store - After search filter ("${filters.search}"):`, filtered.length);
    }

    console.log('✅ Store - Final filtered count:', filtered.length);
    set({ filteredDresses: filtered });
  },

  resetFilters: () => {
    const { dresses } = get();
    console.log('🔄 Store - Resetting filters');
    // Ensure dresses is an array
    const filteredDresses = Array.isArray(dresses) ? dresses : [];
    set({ filteredDresses });
  },
}));