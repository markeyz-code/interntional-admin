<template>
  <div class="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-2">
    <!-- Form Side -->
    <div class="w-full h-full flex items-center justify-center p-8 sm:p-12 order-2 lg:order-1">
      <div class="w-full max-w-md">
        <div v-if="!submitted">
          <div class="mb-8">
            <div class="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
              <Lock class="w-6 h-6 text-brand" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Create new password</h2>
            <p class="text-gray-500 text-sm leading-relaxed">Your new password must be different from previous used passwords.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <UiInput
              id="password"
              label="New Password"
              type="password"
              v-model="form.password"
              required
              placeholder="••••••••"
              :disabled="loading"
            />
            
            <UiInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              v-model="form.confirmPassword"
              required
              placeholder="••••••••"
              :disabled="loading"
            />

            <div v-if="error" class="text-red-700 text-sm p-4 bg-red-50 border border-red-200 flex items-start gap-3 rounded-lg">
              <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{{ error }}</span>
            </div>

            <UiButton type="submit" :loading="loading" class="w-full py-3 text-base font-semibold">
              Reset Password
            </UiButton>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck class="w-8 h-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Password Reset</h2>
          <p class="text-gray-500 text-sm leading-relaxed mb-8">
            Your password has been successfully reset. You can now use your new password to sign in.
          </p>
          <NuxtLink to="/login" class="inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand w-full transition-colors">
            Continue to Sign In
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Image Side -->
    <div class="hidden lg:block relative bg-gray-900 order-1 lg:order-2 h-screen">
      <img src="/lab-hero.png" alt="Admin" class="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div class="absolute inset-0 flex flex-col justify-between p-12">
        <img src="/logo-icon.png" class="h-10 w-auto object-contain" alt="Admin Portal" />
        <div class="text-white space-y-4 max-w-md z-10">
          <h2 class="text-4xl font-bold leading-tight">Secure Access</h2>
          <p class="text-gray-300 font-light leading-relaxed">Create a strong password to ensure the security of the admin portal and ecosystem data.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta, useRoute } from '#imports';
import { Lock, ShieldAlert, ShieldCheck } from 'lucide-vue-next';
import { authApi } from '@/api_factory/modules/auth';
import UiInput from '@/components/ui/Input.vue';
import UiButton from '@/components/ui/Button.vue';

definePageMeta({ layout: 'empty' });

useSeoMeta({
  title: 'Reset Password - Admin Portal',
  description: 'Create a new admin password.',
});

const route = useRoute();
const token = ref('');

const form = ref({
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref<string | null>(null);
const submitted = ref(false);

onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token as string;
  } else {
    error.value = 'Invalid or missing reset token. Please request a new password reset link.';
  }
});

const handleSubmit = async () => {
  if (!token.value) {
    error.value = 'Invalid or missing reset token. Please request a new password reset link.';
    return;
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.';
    return;
  }
  
  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long.';
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    await authApi.adminResetPassword({ 
      token: token.value,
      password: form.value.password
    });
    submitted.value = true;
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.data?.message || 'Failed to reset password. The link may be expired.';
  } finally {
    loading.value = false;
  }
};
</script>
