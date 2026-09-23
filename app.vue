<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <UiSessionTimeoutModal />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSessionTimeout } from '@/composables/core/useSessionTimeout';
import UiSessionTimeoutModal from '@/components/ui/SessionTimeoutModal.vue';

const { initSessionTimeout } = useSessionTimeout();

onMounted(() => {
  initSessionTimeout();
});
</script>
