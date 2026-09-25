<template>
  <div v-if="isWarningVisible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Header -->
      <div class="bg-brand text-white p-6 flex flex-col items-center text-center">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <Clock class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-lg font-black">Are you still there?</h2>
      </div>

      <!-- Body -->
      <div class="p-6 text-center space-y-4">
        <p class="text-gray-600 text-lg">
          For your security, your session will automatically expire in <br />
          <strong class="text-red-500 font-bold text-lg">{{ countdown }}</strong><br />
          seconds.
        </p>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 bg-gray-50 flex gap-3">
        <button 
          @click="handleSessionExpired" 
          class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Log Out Now
        </button>
        <button 
          @click="renewSession" 
          class="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Keep Me Logged In
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { useSessionTimeout } from '@/composables/core/useSessionTimeout';

const { isWarningVisible, countdown, renewSession, handleSessionExpired } = useSessionTimeout();
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.animate-in {
  animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
}
</style>
