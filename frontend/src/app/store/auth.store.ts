import { create } from 'zustand';
import api, { initCsrfCookie } from '../../services/api/client';
import axios from 'axios';

// Define expected shaping of Laravel error responses
export interface LaravelValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  globalError: string | null;
  login: (credentials: Record<string, any>) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  globalError: null,

  clearError: () => set({ globalError: null }),

  login: async (credentials) => {
    try {
      set({ isLoading: true, globalError: null });
      
      // Initialize CSRF-cookie before authenticating
      await initCsrfCookie();
      
      // Send login request
      const response = await api.post('/login', credentials);
      
      set({ user: response.data.user || response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred during login.';
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.response.status === 422) {
          errorMessage = error.response.data.message || 'Invalid data provided.';
        }
      }
      set({ globalError: errorMessage, isLoading: false });
      throw error; // Re-throw so components can access field-level validation errors
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, globalError: null });
      
      // Initialize CSRF-cookie
      await initCsrfCookie();
      
      const response = await api.post('/register', data);
      set({ user: response.data.user || response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred during registration.';
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          errorMessage = error.response.data.message || 'Validation failed.';
        }
      }
      set({ globalError: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Regardless of failure on backend, wipe state
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, globalError: null });
      const response = await api.get('/user');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
