import { ref, reactive, watch } from 'vue';
import { vaultApi } from '@/api_factory/modules/vault';
import { storageApi } from '@/api_factory/modules/storage';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { debounce } from 'lodash-es';
import axios from 'axios';

export const useManageVault = () => {
  const { showToast } = useCustomToast();
  
  const loading = ref(false);
  const uploadProgress = ref(0);
  const deleting = ref<string | null>(null);
  const resources = ref<any[]>([]);
  const total = ref(0);
  const totalPages = ref(1);

  const filters = reactive({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: '',
    category: 'All'
  });

  const getResources = async () => {
    loading.value = true;
    try {
      const { data } = await vaultApi.getResources({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        category: filters.category || undefined
      });
      if (data.data) {
        resources.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        resources.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to fetch resources.', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(getResources, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate || newVal.category !== oldVal.category) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  const uploadResource = async (payload: {
    title: string;
    description?: string;
    category: string;
    type: string;
    file: File;
  }) => {
    loading.value = true;
    uploadProgress.value = 0;
    try {
      // 1. Get signature from backend
      const { data: sigData } = await storageApi.getUploadSignature({
        folder: 'interntional/vault',
      });

      // 2. Build FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);
      if (sigData.eager) {
        formData.append('eager', sigData.eager);
      }

      // 3. Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`;
      
      const { data: uploadResult } = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) uploadProgress.value = Math.round((e.loaded / e.total) * 100);
        },
      });

      // 4. Create resource in DB
      await vaultApi.createResource({
        title: payload.title,
        description: payload.description,
        category: payload.category,
        type: payload.type,
        fileUrl: uploadResult.secure_url,
      });

      showToast({ title: 'Success', message: 'Resource uploaded successfully.', type: 'success' });
      await getResources();
      return true;
    } catch (err: any) {
      showToast({ title: 'Upload Failed', message: err.message || 'Failed to upload resource.', type: 'error' });
      return false;
    } finally {
      loading.value = false;
      uploadProgress.value = 0;
    }
  };

  const deleteResource = async (id: string) => {
    deleting.value = id;
    try {
      await vaultApi.deleteResource(id);
      resources.value = resources.value.filter(r => r._id !== id);
      showToast({ title: 'Deleted', message: 'Resource removed from vault.', type: 'success' });
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to delete resource.', type: 'error' });
      return false;
    } finally {
      deleting.value = null;
    }
  };

  const updateResource = async (id: string, payload: any) => {
    loading.value = true;
    try {
      await vaultApi.updateResource(id, payload);
      showToast({ title: 'Updated', message: 'Resource updated successfully.', type: 'success' });
      const idx = resources.value.findIndex(r => r._id === id);
      if (idx !== -1) {
        resources.value[idx] = { ...resources.value[idx], ...payload };
      }
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to update resource.', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { 
    loading, 
    uploadProgress, 
    deleting, 
    resources, 
    filters,
    total,
    totalPages,
    getResources, 
    uploadResource, 
    updateResource,
    deleteResource 
  };
};
