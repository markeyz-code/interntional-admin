import { useState } from '#app';
import { computed } from 'vue';

export const useAuth = () => {
  const token = useState<string | null>('admin_auth_token', () => null);
  const user = useState<any>('admin_auth_user', () => null);
  const isLoggedIn = computed(() => !!token.value);

  const initAuth = () => {
    if (!import.meta.client) return;
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    token.value = storedToken ?? null;
    if (storedUser) {
      try { user.value = JSON.parse(storedUser); } catch {}
    }
  };

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken;
    user.value = newUser;
    if (import.meta.client) {
      localStorage.setItem('admin_token', newToken);
      localStorage.setItem('admin_user', JSON.stringify(newUser));
    }
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  };

  const getToken = () => {
    if (token.value) return token.value;
    if (import.meta.client) return localStorage.getItem('admin_token');
    return null;
  };

  return { token, user, isLoggedIn, initAuth, setAuth, clearAuth, getToken };
};
