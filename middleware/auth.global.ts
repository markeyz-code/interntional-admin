import { useAuth } from '@/composables/core/useAuth';

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, initAuth } = useAuth();

  // Run on both server (via request cookies) and client (via storage)
  initAuth();

  const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/setup-password'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // If the user is NOT authenticated, default to showing the login page immediately.
  // Never render the dashboard layout or dashboard content on SSR for unauthenticated users.
  if (!isLoggedIn.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  // If the user IS authenticated and trying to access a public page like login, redirect to root dashboard
  if (isLoggedIn.value && isPublicRoute) {
    return navigateTo('/');
  }
});
