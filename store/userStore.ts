import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';
import type { User, AuthState } from '@/types';

interface UserStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const USER_STORAGE_KEY = 'yllure_user';

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // For development, mock authentication
      // Replace with actual API call when ready
      // const response = await apiService.login(email, password);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Jane Doe',
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store user data
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      
      set({ 
        user: mockUser,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      // Clear stored user data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      // TODO: Call API logout when available
      // await apiService.logout();
      
      set({ 
        user: null,
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    
    try {
      // Load from AsyncStorage first
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (stored) {
        const user = JSON.parse(stored);
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false 
        });
        return;
      }
      
      // TODO: Validate with server when API is available
      // const response = await apiService.getCurrentUser();
      // if (response.success && response.data) {
      //   set({ 
      //     user: response.data,
      //     isAuthenticated: true 
      //   });
      // }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to load user:', error);
      set({ isLoading: false });
    }
  },

  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData };
      set({ user: updatedUser });
      
      // Persist updated user data
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
        .catch(error => console.error('Failed to persist user update:', error));
    }
  },
}));