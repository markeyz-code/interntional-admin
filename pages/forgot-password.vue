<template>
  <div class="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-2">
    <!-- Form Side -->
    <div class="w-full h-full flex items-center justify-center p-8 sm:p-12 order-2 lg:order-1">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <NuxtLink to="/login" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-8">
            <ArrowLeft class="w-4 h-4" />
            Back to Sign In
          </NuxtLink>
        </div>

        <div v-if="!submitted">
          <div class="mb-8">
            <div class="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
              <KeyRound class="w-6 h-6 text-brand" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
            <p class="text-gray-500 text-sm leading-relaxed">Enter your admin email and we'll send you a secure link to reset your password.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <UiInput
              id="email"
              label="Admin Email"
              type="email"
              v-model="email"
              required
              placeholder="admin@medlabconvo.com"
              :disabled="loading"
            />

            <div v-if="error" class="text-red-700 text-sm p-4 bg-red-50 border border-red-200 flex items-start gap-3 rounded-lg">
              <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{{ error }}</span>
            </div>

            <UiButton type="submit" :loading="loading" class="w-full py-3 text-base font-semibold">
              Send Reset Link
            </UiButton>
          </form>
        </div>

        <div v-else class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <MailCheck class="w-8 h-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Check your inbox</h2>
          <p class="text-gray-500 text-sm leading-relaxed mb-8">
            If <strong>{{ email }}</strong> is a registered admin account, you will receive a password reset link within a few minutes.
          </p>
          <p class="text-xs text-gray-400 mb-6">Didn't get it? Check your spam folder or try again.</p>
          <button @click="submitted = false; email = ''" class="text-sm text-brand hover:underline font-medium">
            Try a different email
          </button>
        </div>
      </div>
    </div>

    <!-- Image Side -->
    <div class="hidden lg:block relative bg-gray-900 order-1 lg:order-2 h-screen">
      <img src="/lab-hero.png" alt="Admin" class="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div class="absolute inset-0 flex flex-col justify-between p-12">
        <img src="/logo-icon.png" class="h-10 w-auto object-contain" alt="Admin Portal" />
        <div class="text-white space-y-4 max-w-md z-10">
          <h2 class="text-4xl font-bold leading-tight">Account Recovery</h2>
          <p class="text-gray-300 font-light leading-relaxed">We'll send a secure one-time link to your registered admin email to help you regain access.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import { ArrowLeft, KeyRound, ShieldAlert, MailCheck } from 'lucide-vue-next';
import { authApi } from '@/api_factory/modules/auth';
import UiInput from '@/components/ui/Input.vue';
import UiButton from '@/components/ui/Button.vue';

definePageMeta({ layout: 'empty' });

useSeoMeta({
  title: 'Forgot Password - Admin Portal',
  description: 'Reset your admin password.',
});

const email = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const submitted = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  try {
    await authApi.adminForgotPassword({ email: email.value });
    submitted.value = true;
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
