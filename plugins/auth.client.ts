import { useAuth } from '@/composables/core/useAuth';

export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth();
  // Ensure storage and cookies are synchronized immediately on client startup
  initAuth();
});
