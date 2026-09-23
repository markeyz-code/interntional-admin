import { useAuth } from '@/composables/core/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, initAuth } = useAuth();
  
  // If running on the server, we don't have access to localStorage. 
  // Skip to prevent SSR layout mismatches (e.g. server renders login page layout, client renders dashboard layout)
  if (import.meta.server) return;

  if (import.meta.client) {
    initAuth();
  }

  // If the user is not authenticated and trying to access a page other than login
  if (!isLoggedIn.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  // If the user is logged in and trying to access the login page
  if (isLoggedIn.value && to.path === '/login') {
    return navigateTo('/');
  }
});
