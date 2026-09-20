import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useCookie } from '#app';

export const usePayments = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const payments = ref<any[]>([]);
  const token = useCookie('auth_token');

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/payments`, {
        headers: { 'Authorization': `Bearer ${token.value}` },
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      payments.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, payments, fetchAll };
};
