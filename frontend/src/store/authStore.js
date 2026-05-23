import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, user } = res.data;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'เข้าสู่ระบบล้มเหลว' };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', data);
          const { token, user } = res.data;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'สมัครสมาชิกล้มเหลว' };
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      updateUser: (userData) => set({ user: userData }),

      initAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }),
    { name: 'gft-auth', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
);

export default useAuthStore;
