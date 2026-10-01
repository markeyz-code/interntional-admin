import { useState, useCookie } from '#app';
import { computed } from 'vue';

export const useAuth = () => {
  const tokenCookie = useCookie<string | null>('admin_token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  });

  const userCookie = useCookie<any>('admin_user', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  });

  const token = useState<string | null>('admin_auth_token', () => tokenCookie.value);
  const user = useState<any>('admin_auth_user', () => userCookie.value);

  const isLoggedIn = computed(() => {
    return !!token.value || !!tokenCookie.value || (import.meta.client && !!localStorage.getItem('admin_token'));
  });

  const initAuth = () => {
    // On server, initialize directly from incoming request cookies
    if (!import.meta.client) {
      if (tokenCookie.value) token.value = tokenCookie.value;
      if (userCookie.value) user.value = userCookie.value;
      return;
    }

    // On client, read from localStorage or cookies and synchronize
    const storedToken = localStorage.getItem('admin_token') || tokenCookie.value;
    let storedUser: any = null;
    try {
      const rawUser = localStorage.getItem('admin_user');
      storedUser = rawUser ? JSON.parse(rawUser) : userCookie.value;
    } catch {
      storedUser = userCookie.value;
    }

    if (storedToken) {
      token.value = storedToken;
      tokenCookie.value = storedToken;
      localStorage.setItem('admin_token', storedToken);

      if (storedUser) {
        user.value = storedUser;
        userCookie.value = storedUser;
        localStorage.setItem('admin_user', JSON.stringify(storedUser));
      }
    } else {
      token.value = null;
      tokenCookie.value = null;
      user.value = null;
      userCookie.value = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  };

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken;
    tokenCookie.value = newToken;

    user.value = newUser;
    userCookie.value = newUser;

    if (import.meta.client) {
      localStorage.setItem('admin_token', newToken);
      localStorage.setItem('admin_user', JSON.stringify(newUser));
    }
  };

  const clearAuth = () => {
    token.value = null;
    tokenCookie.value = null;
    user.value = null;
    userCookie.value = null;

    if (import.meta.client) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  };

  const getToken = () => {
    if (token.value) return token.value;
    if (tokenCookie.value) return tokenCookie.value;
    if (import.meta.client) return localStorage.getItem('admin_token');
    return null;
  };

  const syncProfile = async () => {
    if (!import.meta.client) return;
    const currentToken = getToken();
    if (!currentToken) return;

    try {
      const { $api } = useNuxtApp();
      const response = await $api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (response.data) {
        // Just update the user portion
        const updatedUser = {
          id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
          department: response.data.department,
          permissions: response.data.permissions,
          adminPlatform: response.data.adminPlatform,
        };
        setAuth(currentToken, updatedUser);
      }
    } catch (error) {
      console.error('Failed to sync admin profile:', error);
      // If unauthorized, we might want to clearAuth(), but we'll just log for now to be safe.
    }
  };

  return { token, user, isLoggedIn, initAuth, setAuth, clearAuth, getToken, syncProfile };
};
