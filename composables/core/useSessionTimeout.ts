import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/core/useAuth';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity before showing warning
const COUNTDOWN_TIME = 60; // 60 seconds to renew after warning appears

// Global state so the modal can react from anywhere
const isWarningVisible = ref(false);
const countdown = ref(COUNTDOWN_TIME);

export const useSessionTimeout = () => {
  const router = useRouter();
  const { isLoggedIn, clearAuth } = useAuth();

  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const resetTimers = () => {
    // Only track if logged in
    if (!isLoggedIn.value) return;

    // Clear existing timers
    if (idleTimer) clearTimeout(idleTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    isWarningVisible.value = false;
    countdown.value = COUNTDOWN_TIME;

    // Set new idle timer
    idleTimer = setTimeout(() => {
      showWarning();
    }, IDLE_TIMEOUT);
  };

  const showWarning = () => {
    if (!isLoggedIn.value) return;
    isWarningVisible.value = true;

    // Start 60 second countdown
    countdownInterval = setInterval(() => {
      countdown.value--;
      
      if (countdown.value <= 0) {
        handleSessionExpired();
      }
    }, 1000);
  };

  const handleSessionExpired = () => {
    if (idleTimer) clearTimeout(idleTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    isWarningVisible.value = false;
    
    // Clear session and redirect
    clearAuth();
    router.push('/login?expired=true');
  };

  const renewSession = () => {
    // This is where you would typically make an API call to refresh the JWT.
    // For now, we just reset the frontend timers.
    resetTimers();
  };

  // Event listeners for user activity
  const handleUserActivity = () => {
    // Throttle the resets so we aren't calling this thousands of times a second
    if (!isWarningVisible.value) {
      resetTimers();
    }
  };

  // Only bind events when initializing (e.g. from app.vue)
  const initSessionTimeout = () => {
    if (!import.meta.client) return;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Bind events
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Start initial timer
    resetTimers();

    onUnmounted(() => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (idleTimer) clearTimeout(idleTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    });
  };

  return {
    isWarningVisible,
    countdown,
    initSessionTimeout,
    renewSession,
    handleSessionExpired
  };
};
