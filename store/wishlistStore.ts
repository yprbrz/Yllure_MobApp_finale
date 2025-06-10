import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';
import type { Dress, WishlistState } from '@/types';

interface WishlistStore extends WishlistState {
  addToWishlist: (dress: Dress) => Promise<void>;
  removeFromWishlist: (dressId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (dressId: string) => boolean;
  persistWishlist: () => Promise<void>;
  loadPersistedWishlist: () => Promise<void>;
}

const WISHLIST_STORAGE_KEY = 'yllure_wishlist';

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistItems: [],
  isLoading: false,

  addToWishlist: async (dress: Dress) => {
    const { wishlistItems, isInWishlist } = get();
    
    if (isInWishlist(dress.id)) {
      console.log('Dress already in wishlist');
      return;
    }

    const updatedWishlist = [...wishlistItems, dress];
    set({ wishlistItems: updatedWishlist });
    
    // Persist to AsyncStorage
    await get().persistWishlist();
    
    // TODO: Sync with server when API is available
    // try {
    //   await apiService.addToWishlist(wishlistId, dress.id);
    // } catch (error) {
    //   console.error('Failed to sync wishlist with server:', error);
    // }
  },

  removeFromWishlist: async (dressId: string) => {
    const { wishlistItems } = get();
    const updatedWishlist = wishlistItems.filter(dress => dress.id !== dressId);
    
    set({ wishlistItems: updatedWishlist });
    
    // Persist to AsyncStorage
    await get().persistWishlist();
    
    // TODO: Sync with server when API is available
    // try {
    //   await apiService.removeFromWishlist(wishlistId, dressId);
    // } catch (error) {
    //   console.error('Failed to sync wishlist with server:', error);
    // }
  },

  clearWishlist: async () => {
    set({ wishlistItems: [] });
    await get().persistWishlist();
    
    // TODO: Sync with server when API is available
  },

  fetchWishlist: async () => {
    set({ isLoading: true });
    
    try {
      // Load from AsyncStorage first (offline support)
      await get().loadPersistedWishlist();
      
      // TODO: Fetch from server and merge when API is available
      // const response = await apiService.getWishlist(wishlistId);
      // if (response.success && response.data) {
      //   const serverWishlist = response.data.items.map(item => item.dress);
      //   set({ wishlistItems: serverWishlist });
      //   await get().persistWishlist();
      // }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  isInWishlist: (dressId: string) => {
    const { wishlistItems } = get();
    return wishlistItems.some(dress => dress.id === dressId);
  },

  persistWishlist: async () => {
    try {
      const { wishlistItems } = get();
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Failed to persist wishlist:', error);
    }
  },

  loadPersistedWishlist: async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const wishlistItems = JSON.parse(stored);
        set({ wishlistItems });
      }
    } catch (error) {
      console.error('Failed to load persisted wishlist:', error);
    }
  },
}));