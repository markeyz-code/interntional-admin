<template>
  <div class="min-h-screen bg-white flex">
    <!-- Image Side -->
    <div class="hidden lg:block lg:w-1/2 relative bg-gray-900">
      <img src="https://images.unsplash.com/photo-1579154204601-52ee6c23b202?q=80&w=2000&auto=format&fit=crop" alt="Medical Laboratory Admin" class="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div class="absolute inset-0 flex flex-col justify-between p-12">
        <img src="~/assets/logo.jpg" class="h-10 w-auto rounded-lg" alt="InternTional Admin" />
        <div class="text-white space-y-4 max-w-md">
          <h2 class="text-4xl font-medium leading-tight">System Management</h2>
          <p class="text-gray-300 font-light">Secure portal for verifying applicants, managing the vault, and overseeing the ecosystem.</p>
        </div>
      </div>
    </div>

    <!-- Form Side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
      <div class="w-full max-w-md">
        <div class="mb-10 lg:hidden text-center">
          <img src="~/assets/logo-icon.png" class="h-8 w-auto mb-2" alt="InternTional Logo" />
        </div>
        
        <h2 class="text-3xl font-medium text-gray-900 mb-2">Admin Sign In</h2>
        <p class="text-gray-500 mb-8">Enter your administrative credentials.</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiInput
            id="email"
            label="Admin Email"
            type="email"
            v-model="form.email"
            required
            placeholder="admin@example.com"
          />

          <UiInput
            id="password"
            label="Password"
            type="password"
            v-model="form.password"
            required
            placeholder="••••••••"
          />

          <div v-if="error" class="text-red-700 text-sm p-4 bg-red-50 border border-red-200 flex items-start gap-3 rounded">
            <Lock class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{{ error }}</span>
          </div>

          <UiButton
            type="submit"
            :loading="loading"
            class="w-full py-3 text-base font-medium"
          >
            Sign In to Dashboard
          </UiButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'Admin Login - InternTional',
  description: 'Sign in to the InternTional admin portal.',
  ogTitle: 'Admin Login - InternTional',
  ogDescription: 'Sign in to the InternTional admin portal.',
  ogImage: 'https://images.unsplash.com/photo-1579154204601-52ee6c23b202?q=80&w=2000&auto=format&fit=crop',
  twitterCard: 'summary_large_image',
})

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Lock } from 'lucide-vue-next';
import { authApi } from '@/api_factory/modules/auth';
import { useAuth } from '@/composables/core/useAuth';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiInput from '@/components/ui/Input.vue';
import UiButton from '@/components/ui/Button.vue';

definePageMeta({ layout: 'empty' });

const router = useRouter();
const { setAuth } = useAuth();
const { showToast } = useCustomToast();

const loading = ref(false);
const error = ref<string | null>(null);
const form = ref({ email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await authApi.login(form.value);
    setAuth(data.access_token, { email: form.value.email, role: 'SUPER_ADMIN' });
    showToast({ title: 'Welcome Admin', message: 'Successfully authenticated.', type: 'success' });
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Authentication failed.';
    showToast({ title: 'Access Denied', message: error.value!, type: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>
