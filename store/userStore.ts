import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';
import type { User, AuthState } from '@/types';

interface UserStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

const USER_STORAGE_KEY = 'yllure_user';
const AUTH_TOKEN_KEY = 'yllure_auth_token';

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('👤 UserStore - Attempting login for:', email);
      
      // Use the real API service
      const response = await apiService.login(email, password);
      console.log('👤 UserStore - Login response:', response);
      
      if (response.success && response.data) {
        const user = response.data;
        
        // Store user data locally
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        
        // Store auth token if provided (when your API supports it)
        // if (response.token) {
        //   await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
        // }
        
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        console.log('✅ UserStore - Login successful');
        return true;
      } else {
        const errorMessage = response.error || 'Login failed';
        set({ 
          isLoading: false,
          error: errorMessage
        });
        console.log('❌ UserStore - Login failed:', errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('❌ UserStore - Login error:', error);
      set({ 
        isLoading: false,
        error: errorMessage
      });
      return false;
    }
  },

  logout: async () => {
    try {
      console.log('👤 UserStore - Logging out...');
      
      // Call API logout
      await apiService.logout();
      
      // Clear stored user data
      await AsyncStorage.multiRemove([USER_STORAGE_KEY, AUTH_TOKEN_KEY]);
      
      set({ 
        user: null,
        isAuthenticated: false,
        error: null
      });
      
      console.log('✅ UserStore - Logout successful');
    } catch (error) {
      console.error('❌ UserStore - Logout failed:', error);
      // Still clear local state even if API call fails
      set({ 
        user: null,
        isAuthenticated: false 
      });
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('👤 UserStore - Loading user from storage...');
      
      // Load from AsyncStorage first
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (stored) {
        const user = JSON.parse(stored);
        console.log('✅ UserStore - User loaded from storage:', user.email);
        
        // Validate with server (when your API supports token validation)
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            // Update with fresh data from server
            const serverUser = response.data;
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(serverUser));
            
            set({ 
              user: serverUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            console.log('✅ UserStore - User validated with server');
            return;
          }
        } catch (serverError) {
          console.log('⚠️ UserStore - Server validation failed, using stored user');
          // Use stored user if server validation fails
        }
        
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return;
      }
      
      console.log('👤 UserStore - No stored user found');
      set({ 
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ UserStore - Failed to load user:', error);
      set({ 
        isLoading: false,
        error: 'Failed to load user data'
      });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      try {
        console.log('👤 UserStore - Updating user:', userData);
        
        const updatedUser = { 
          ...user, 
          ...userData,
          updatedAt: new Date().toISOString()
        };
        
        // Update local state immediately
        set({ user: updatedUser });
        
        // Persist updated user data
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        
        // TODO: Sync with server when your API supports user updates
        // const response = await apiService.updateUser(updatedUser);
        // if (response.success) {
        //   console.log('✅ UserStore - User updated on server');
        // }
        
        console.log('✅ UserStore - User updated locally');
      } catch (error) {
        console.error('❌ UserStore - Failed to update user:', error);
        set({ error: 'Failed to update user data' });
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Helper functions for other parts of the app
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useUserStore();
  return { user, isAuthenticated, isLoading };
};

export const useAuthActions = () => {
  const { login, logout, loadUser, updateUser, clearError } = useUserStore();
  return { login, logout, loadUser, updateUser, clearError };
};