import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuth } from '@/composables/core/useAuth';

export const useRoles = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const allUsers = ref<any[]>([]);
  const userStats = ref<any>(null);

  const fetchAllUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/users/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      allUsers.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/users/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      userStats.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error('Failed to update role');
      const updated = await response.json();
      // Update local state
      const idx = allUsers.value.findIndex(u => u._id === userId);
      if (idx !== -1) allUsers.value[idx] = { ...allUsers.value[idx], ...updated };
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    }
  };

  const updateUserDepartment = async (userId: string, department: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}/users/${userId}/department`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ department }),
      });
      if (!response.ok) throw new Error('Failed to update department');
      const updated = await response.json();
      const idx = allUsers.value.findIndex(u => u._id === userId);
      if (idx !== -1) allUsers.value[idx] = { ...allUsers.value[idx], ...updated };
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      const response = await fetch(`${config.public.apiBase}/users/${userId}/permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ permissions }),
      });
      if (!response.ok) throw new Error('Failed to update permissions');
      const updated = await response.json();
      const idx = allUsers.value.findIndex(u => u._id === userId);
      if (idx !== -1) allUsers.value[idx] = { ...allUsers.value[idx], ...updated };
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    }
  };

  return {
    loading,
    error,
    allUsers,
    userStats,
    fetchAllUsers,
    fetchUserStats,
    updateUserRole,
    updateUserDepartment,
    updateUserPermissions,
  };
};
