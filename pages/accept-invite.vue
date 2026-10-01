<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-500">Validating your invitation...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Invalid or Expired Invitation</h2>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <NuxtLink to="/login" class="text-brand font-medium hover:underline">Return to Login</NuxtLink>
      </div>
      
      <div v-else-if="success" class="text-center py-8">
        <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
        <p class="text-gray-500 mb-6">Your admin account has been set up successfully.</p>
        <button @click="proceedToDashboard" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-[#1f4e70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand">
          Go to Dashboard
        </button>
      </div>
      
      <div v-else>
        <div class="text-center">
          <h2 class="mt-2 text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <p class="mt-2 text-sm text-gray-500">
            You've been invited to join the Admin team.
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="submit">
          <div class="space-y-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input id="firstName" v-model="form.firstName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input id="lastName" v-model="form.lastName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Create Password</label>
              <input id="password" v-model="form.password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
            </div>
          </div>
          
          <div v-if="submitError" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {{ submitError }}
          </div>

          <div>
            <button type="submit" :disabled="submitting" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-[#1f4e70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50">
              <span v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Complete Registration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#imports';
import { useAuth } from '@/composables/core/useAuth';
import { useBusinessContext } from '@/composables/core/useBusinessContext';

definePageMeta({ layout: 'empty' });

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const { setAuth } = useAuth();
const { setBusiness } = useBusinessContext();

const token = route.query.token as string;
const loading = ref(false); // Initially false, we just let them submit directly since the token will be validated on submit. Or we can validate it first. Let's just validate on submit to save a request.
const error = ref('');
const submitting = ref(false);
const submitError = ref('');
const success = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  password: ''
});

onMounted(() => {
  if (!token) {
    error.value = 'No invitation token provided in the URL.';
  }
});

const submit = async () => {
  submitting.value = true;
  submitError.value = '';
  
  try {
    const res = await $api.post('/auth/admin/accept-invite', {
      token,
      ...form
    });
    
    // Auto login
    if (res.access_token && res.user) {
      setAuth(res.user, res.access_token);
      
      // Navigate appropriately based on platform
      if (res.user.adminPlatform === 'universe') {
        setBusiness('uniVerse');
      } else if (res.user.adminPlatform === 'interntional') {
        setBusiness('internTional');
      }
    }
    
    success.value = true;
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Failed to register account. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const proceedToDashboard = () => {
  router.push('/overview');
};
</script>
