import { create } from 'zustand';
import { apiService, mockDresses } from '@/services/api';
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
  dresses: [],
  featuredDresses: [],
  filteredDresses: [],
  isLoading: false,

  fetchDresses: async () => {
    set({ isLoading: true });
    try {
      // For development, use mock data
      // Replace with actual API call when ready
      // const response = await apiService.getDresses();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dresses = mockDresses;
      set({ 
        dresses,
        filteredDresses: dresses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch dresses:', error);
      set({ isLoading: false });
    }
  },

  fetchFeaturedDresses: async () => {
    set({ isLoading: true });
    try {
      // For development, use mock data
      // Replace with actual API call when ready
      // const response = await apiService.getFeaturedDresses();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const featuredDresses = mockDresses.filter(dress => dress.featured && dress.available);
      set({ 
        featuredDresses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch featured dresses:', error);
      set({ isLoading: false });
    }
  },

  fetchDress: async (id: string) => {
    try {
      // For development, use mock data
      // Replace with actual API call when ready
      // const response = await apiService.getDress(id);
      
      const dress = mockDresses.find(d => d.id === id);
      return dress || null;
    } catch (error) {
      console.error('Failed to fetch dress:', error);
      return null;
    }
  },

  searchDresses: async (query: string) => {
    set({ isLoading: true });
    try {
      // For development, use mock data
      // Replace with actual API call when ready
      // const response = await apiService.searchDresses(query);
      
      const { dresses } = get();
      const filtered = dresses.filter(dress =>
        dress.name.toLowerCase().includes(query.toLowerCase()) ||
        dress.description.toLowerCase().includes(query.toLowerCase())
      );
      
      set({ 
        filteredDresses: filtered,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to search dresses:', error);
      set({ isLoading: false });
    }
  },

  applyFilters: (filters: DressFilters) => {
    const { dresses } = get();
    
    let filtered = [...dresses];

    // Filter by size
    if (filters.size) {
      filtered = filtered.filter(dress => dress.size === filters.size);
    }

    // Filter by availability
    if (filters.available !== undefined) {
      filtered = filtered.filter(dress => dress.available === filters.available);
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(dress => dress.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(dress => dress.price <= filters.priceMax!);
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(dress =>
        dress.name.toLowerCase().includes(query) ||
        dress.description.toLowerCase().includes(query)
      );
    }

    set({ filteredDresses: filtered });
  },

  resetFilters: () => {
    const { dresses } = get();
    set({ filteredDresses: dresses });
  },
}));