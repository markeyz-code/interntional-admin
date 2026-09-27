<template>
  <div class="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-2">
    <!-- Form Side -->
    <div class="w-full h-full flex items-center justify-center p-8 sm:p-12 order-2 lg:order-1">
      <div class="w-full max-w-md">
        <div class="mb-10 lg:hidden text-center">
          <img src="/logo-icon.png" class="h-8 w-auto mb-2 object-contain mx-auto" alt="Admin Logo" />
        </div>

        <!-- ── STEP 1: Email + Password ── -->
        <div v-if="step === 'credentials'">
          <h2 class="text-2xl font-bold text-gray-900 mb-1">Admin Sign In</h2>
          <p class="text-gray-500 mb-8 text-sm">Enter your administrative credentials to continue.</p>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <UiInput
              id="email"
              label="Admin Email"
              type="email"
              v-model="form.email"
              required
              placeholder="admin@medlabconvo.com"
            />
            <div>
              <UiInput
                id="password"
                label="Password"
                type="password"
                v-model="form.password"
                required
                placeholder="••••••••"
              />
              <div class="mt-2 text-right">
                <NuxtLink to="/forgot-password" class="text-xs text-brand hover:underline font-medium">
                  Forgot password?
                </NuxtLink>
              </div>
            </div>

            <div v-if="error" class="text-red-700 text-sm p-4 bg-red-50 border border-red-200 flex items-start gap-3 rounded-lg">
              <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{{ error }}</span>
            </div>

            <UiButton type="submit" :loading="loading" class="w-full py-3 text-base font-semibold">
              Continue →
            </UiButton>
          </form>
        </div>

        <!-- ── STEP 2: OTP Verification ── -->
        <div v-else-if="step === 'otp'">
          <div class="mb-6 flex items-center gap-3">
            <button @click="step = 'credentials'" class="text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Check your email</h2>
              <p class="text-gray-500 text-sm mt-1">We sent a 6-digit code to <strong>{{ form.email }}</strong></p>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
            <Mail class="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <p class="text-sm text-blue-800">Enter the code from your email to complete sign-in. The code expires in 10 minutes.</p>
          </div>

          <form @submit.prevent="handleOtpVerify" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3 text-center">Verification Code</label>
              <div class="flex justify-center gap-2 sm:gap-3">
                <input
                  v-for="(digit, index) in 6"
                  :key="index"
                  ref="otpInputs"
                  v-model="otpValues[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  required
                  class="w-12 h-14 sm:w-14 sm:h-16 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold text-gray-900 focus:border-brand focus:ring-4 focus:ring-brand/20 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  :disabled="verifying"
                  @input="onOtpInput(index, $event)"
                  @keydown="onOtpKeydown(index, $event)"
                  @paste="onOtpPaste($event)"
                />
              </div>
            </div>

            <div v-if="otpError" class="text-red-700 text-sm p-4 bg-red-50 border border-red-200 flex items-start gap-3 rounded-lg">
              <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{{ otpError }}</span>
            </div>

            <UiButton type="submit" :loading="verifying" class="w-full py-3 text-base font-semibold mt-6">
              Verify & Sign In
            </UiButton>

            <button
              type="button"
              @click="resendOtp"
              :disabled="resendCountdown > 0 || loading"
              class="w-full text-sm text-gray-500 hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="resendCountdown > 0">Resend code in {{ resendCountdown }}s</span>
              <span v-else>Didn't receive the code? Resend</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Image Side -->
    <div class="hidden lg:block relative bg-gray-900 order-1 lg:order-2 h-screen">
      <img src="/lab-hero.png" alt="Medical Laboratory Admin" class="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div class="absolute inset-0 flex flex-col justify-between p-12">
        <img src="/logo-icon.png" class="h-10 w-auto object-contain" alt="Admin Portal" />
        <div class="text-white space-y-4 max-w-md z-10">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 mb-4">
            <ShieldCheck class="w-3.5 h-3.5" />
            SECURE ADMIN PORTAL
          </div>
          <h2 class="text-4xl font-bold leading-tight">System Management</h2>
          <p class="text-gray-300 font-light leading-relaxed">Secure portal for verifying applicants, managing the vault, and overseeing the ecosystem. Two-factor authentication required.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSeoMeta } from '#imports';
import { useRouter } from 'vue-router';
import { Lock, ShieldAlert, ShieldCheck, Mail, ArrowLeft } from 'lucide-vue-next';
import { authApi } from '@/api_factory/modules/auth';
import { useAuth } from '@/composables/core/useAuth';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiInput from '@/components/ui/Input.vue';
import UiButton from '@/components/ui/Button.vue';

definePageMeta({ layout: 'empty' });

useSeoMeta({
  title: 'Admin Login - MedLab Convo',
  description: 'Sign in to the Admin portal with two-factor authentication.',
});

const router = useRouter();
const { setAuth } = useAuth();
const { showToast } = useCustomToast();

const step = ref<'credentials' | 'otp'>('credentials');
const loading = ref(false);
const verifying = ref(false);
const error = ref<string | null>(null);
const otpError = ref<string | null>(null);
const form = ref({ email: '', password: '' });

// ── OTP State & Logic ─────────────────────────────────────
const otpValues = ref<string[]>(Array(6).fill(''));
const otpInputs = ref<HTMLInputElement[] | null>(null);

const onOtpInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = target.value.replace(/[^0-9]/g, '');
  
  otpValues.value[index] = val.slice(-1);
  
  if (val && index < 5 && otpInputs.value) {
    otpInputs.value[index + 1].focus();
  }
};

const onOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0 && otpInputs.value) {
    otpInputs.value[index - 1].focus();
  }
};

const onOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
  if (!pastedData) return;
  
  for (let i = 0; i < pastedData.length; i++) {
    otpValues.value[i] = pastedData[i];
  }
  
  const focusIndex = Math.min(pastedData.length, 5);
  if (otpInputs.value) {
    otpInputs.value[focusIndex].focus();
  }
};

const getOtpString = () => otpValues.value.join('');

// ── Resend countdown ──────────────────────────────────────
const resendCountdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  resendCountdown.value = 60;
  countdownTimer = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
};

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});

// ── Step 1: Submit credentials ────────────────────────────
const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    await authApi.adminLogin({ email: form.value.email, password: form.value.password });
    step.value = 'otp';
    startCountdown();
    // Auto-focus first input on next tick
    setTimeout(() => {
      if (otpInputs.value && otpInputs.value.length > 0) {
        otpInputs.value[0].focus();
      }
    }, 100);
    showToast({ title: 'Code sent!', message: `A 6-digit code was sent to ${form.value.email}`, type: 'success' });
  } catch (err: any) {
    error.value = err?.response?.data?.message || err?.data?.message || err?.message || 'Authentication failed.';
  } finally {
    loading.value = false;
  }
};

// ── Step 2: Verify OTP ────────────────────────────────────
const handleOtpVerify = async () => {
  const finalOtp = getOtpString();
  if (finalOtp.length !== 6) {
    otpError.value = 'Please enter the full 6-digit code.';
    return;
  }
  verifying.value = true;
  otpError.value = null;
  try {
    const { data } = await authApi.adminVerifyOtp({ email: form.value.email, otp: finalOtp });
    setAuth(data.access_token, data.user);
    showToast({ title: 'Welcome!', message: `Signed in as ${data.user?.firstName || 'Admin'}`, type: 'success' });
    router.push('/');
  } catch (err: any) {
    otpError.value = err?.response?.data?.message || err?.data?.message || 'Invalid or expired code. Please try again.';
    otpValues.value = Array(6).fill('');
    if (otpInputs.value && otpInputs.value.length > 0) otpInputs.value[0].focus();
  } finally {
    verifying.value = false;
  }
};

// ── Resend OTP ────────────────────────────────────────────
const resendOtp = async () => {
  if (resendCountdown.value > 0) return;
  loading.value = true;
  try {
    await authApi.adminLogin({ email: form.value.email, password: form.value.password });
    startCountdown();
    otpValues.value = Array(6).fill('');
    if (otpInputs.value && otpInputs.value.length > 0) otpInputs.value[0].focus();
    otpError.value = null;
    showToast({ title: 'Code resent!', message: 'A new code has been sent to your email.', type: 'success' });
  } catch (err: any) {
    otpError.value = 'Failed to resend code. Please go back and try again.';
  } finally {
    loading.value = false;
  }
};
</script>
