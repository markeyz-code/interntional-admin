import { ref } from 'vue';
import axios from 'axios';
import { useAuth } from '@/composables/core/useAuth';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useMarketplace = () => {
  const { token } = useAuth();
  const { showToast } = useCustomToast();
  const products = ref<any[]>([]);
  const myProducts = ref<any[]>([]);
  const purchases = ref<any[]>([]);
  const loading = ref(false);

  const getProducts = async (environment: string, category?: string) => {
    loading.value = true;
    try {
      let url = `http://localhost:4000/api/v1/marketplace/products?environment=${environment}`;
      if (category) url += `&category=${category}`;
      const res = await axios.get(url);
      products.value = res.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const getMyPurchases = async () => {
    loading.value = true;
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/marketplace/purchases`, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      purchases.value = res.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (payload: any) => {
    loading.value = true;
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/marketplace/create`, payload, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      showToast({ title: 'Success', message: 'Product published successfully', type: 'success' });
      return res.data;
    } catch (error: any) {
      showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to publish product', type: 'error' });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const purchaseProduct = async (productId: string, reference: string) => {
    loading.value = true;
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/marketplace/purchase`, { productId, reference }, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      showToast({ title: 'Success', message: 'Purchase successful', type: 'success' });
      return res.data;
    } catch (error: any) {
      showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to complete purchase', type: 'error' });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const downloadProduct = async (productId: string) => {
    loading.value = true;
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/marketplace/download/${productId}`, {
        headers: { Authorization: `Bearer ${token.value}` }
      });
      window.open(res.data.fileUrl, '_blank');
    } catch (error: any) {
      showToast({ title: 'Error', message: error.response?.data?.message || 'Download failed', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    myProducts,
    purchases,
    loading,
    getProducts,
    getMyPurchases,
    createProduct,
    purchaseProduct,
    downloadProduct
  };
};
