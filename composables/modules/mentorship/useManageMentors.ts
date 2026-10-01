import { ref } from 'vue';
import { mentorshipApi } from '@/api_factory/modules/mentorship';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useManageMentors = () => {
  const { showToast } = useCustomToast();
  const mentors = ref([]);
  const categories = ref([]);
  const loading = ref(false);

  const fetchMentors = async () => {
    try {
      loading.value = true;
      const res = await mentorshipApi.getMentors();
      mentors.value = res.data;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to fetch mentors', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const createMentor = async (data: any) => {
    try {
      loading.value = true;
      await mentorshipApi.createMentor(data);
      showToast({ title: 'Success', message: 'Mentor created successfully', type: 'success' });
      await fetchMentors();
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to create mentor', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateMentor = async (id: string, data: any) => {
    try {
      loading.value = true;
      await mentorshipApi.updateMentor(id, data);
      showToast({ title: 'Success', message: 'Mentor updated successfully', type: 'success' });
      await fetchMentors();
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to update mentor', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteMentor = async (id: string) => {
    try {
      loading.value = true;
      await mentorshipApi.deleteMentor(id);
      showToast({ title: 'Success', message: 'Mentor deleted', type: 'success' });
      await fetchMentors();
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to delete mentor', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      loading.value = true;
      const res = await mentorshipApi.getCategories();
      categories.value = res.data;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to fetch categories', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (data: any) => {
    try {
      loading.value = true;
      await mentorshipApi.createCategory(data);
      showToast({ title: 'Success', message: 'Category created successfully', type: 'success' });
      await fetchCategories();
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to create category', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      loading.value = true;
      await mentorshipApi.deleteCategory(id);
      showToast({ title: 'Success', message: 'Category deleted', type: 'success' });
      await fetchCategories();
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to delete category', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    mentors, categories, loading,
    fetchMentors, createMentor, updateMentor, deleteMentor,
    fetchCategories, createCategory, deleteCategory
  };
};
