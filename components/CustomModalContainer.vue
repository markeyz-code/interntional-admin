<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modalState.isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        @click.self="onCancel"
      >
        <div
          class="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all"
        >
          <!-- Top Icon & Close -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              :class="iconStyles.bg"
            >
              <component :is="iconStyles.icon" class="w-6 h-6" :class="iconStyles.color" />
            </div>

            <button
              @click="onCancel"
              class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Title & Message -->
          <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ modalState.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{{ modalState.message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              v-if="modalState.isConfirm"
              type="button"
              @click="onCancel"
              class="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {{ modalState.cancelText || 'Cancel' }}
            </button>
            <button
              type="button"
              @click="onConfirm"
              class="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-sm cursor-pointer"
              :class="buttonStyles"
            >
              {{ modalState.confirmText || (modalState.isConfirm ? 'Confirm' : 'Got it') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, Info } from 'lucide-vue-next';
import { useCustomModal } from '@/composables/core/useCustomModal';

const { modalState, onConfirm, onCancel } = useCustomModal();

const iconStyles = computed(() => {
  switch (modalState.value.type) {
    case 'danger':
      return {
        icon: ShieldAlert,
        bg: 'bg-red-50 border border-red-100',
        color: 'text-red-600',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bg: 'bg-amber-50 border border-amber-100',
        color: 'text-amber-600',
      };
    case 'success':
      return {
        icon: CheckCircle2,
        bg: 'bg-emerald-50 border border-emerald-100',
        color: 'text-emerald-600',
      };
    default:
      return {
        icon: Info,
        bg: 'bg-blue-50 border border-blue-100',
        color: 'text-[#1f4e70]',
      };
  }
});

const buttonStyles = computed(() => {
  switch (modalState.value.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500/20';
    case 'warning':
      return 'bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/20';
    case 'success':
      return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20';
    default:
      return 'bg-[#1f4e70] hover:bg-[#163852] focus:ring-4 focus:ring-[#1f4e70]/20';
  }
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && modalState.value.isOpen) {
    onCancel();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
