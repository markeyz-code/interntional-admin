import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useCookie } from '#app';

export const useGetEnquiries = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const enquiries = ref<any[]>([]);
  const token = useCookie('auth_token');

  const fetchEnquiries = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${config.public.apiBase}/enquiries`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }

      enquiries.value = await response.json();
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}/enquiries/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (response.ok) {
        const index = enquiries.value.findIndex(e => e._id === id);
        if (index !== -1) {
          enquiries.value[index].status = 'read';
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return {
    loading,
    error,
    enquiries,
    fetchEnquiries,
    markAsRead
  };
};
