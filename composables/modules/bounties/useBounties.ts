import { ref } from 'vue';
import axios from 'axios';
import { useAuth } from '@/composables/core/useAuth';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useBounties = () => {
  const { token } = useAuth();
  const { showToast } = useCustomToast();
  const bounties = ref<any[]>([]);
  const myBookings = ref<any[]>([]);
  const loading = ref(false);

  const getBounties = async (environment: string, category?: string) => {
    loading.value = true;
    try {
      let url = `http://localhost:4000/api/v1/bounties?environment=${environment}`;
      if (category) url += `&category=${category}`;
      const res = await axios.get(url);
      bounties.value = res.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const getMyBookings = async () => {
    loading.value = true;
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/bounties/my-bookings`, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      myBookings.value = res.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const createBounty = async (payload: any) => {
    loading.value = true;
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/bounties/create`, payload, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      showToast({ title: 'Success', message: 'Bounty published successfully', type: 'success' });
      return res.data;
    } catch (error: any) {
      showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to publish bounty', type: 'error' });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const bookBounty = async (bountyId: string, reference: string, clientNotes: string) => {
    loading.value = true;
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/bounties/book`, { bountyId, reference, clientNotes }, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      showToast({ title: 'Success', message: 'Bounty booked successfully', type: 'success' });
      return res.data;
    } catch (error: any) {
      showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to book bounty', type: 'error' });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    bounties,
    myBookings,
    loading,
    getBounties,
    getMyBookings,
    createBounty,
    bookBounty,
  };
};
