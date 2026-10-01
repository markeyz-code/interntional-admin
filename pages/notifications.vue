<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Notifications Management</h1>
        <p class="text-sm text-gray-500 mt-1">View notification history and trigger manual push notifications to users.</p>
      </div>
      <button @click="isModalOpen = true" class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors">
        Trigger Notification
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Target User</th>
            <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Notification</th>
            <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
            <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading" class="text-center">
            <td colspan="5" class="p-8"><div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div></td>
          </tr>
          <tr v-else-if="notifications.length === 0" class="text-center">
            <td colspan="5" class="p-8 text-gray-500">No notifications found.</td>
          </tr>
          <tr v-for="notif in notifications" :key="notif._id" class="hover:bg-gray-50">
            <td class="p-4">
              <div v-if="notif.userId">
                <p class="font-bold text-sm text-gray-900">{{ notif.userId.firstName }} {{ notif.userId.lastName }}</p>
                <p class="text-xs text-gray-500">{{ notif.userId.email }}</p>
              </div>
              <span v-else class="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">BROADCAST</span>
            </td>
            <td class="p-4 max-w-xs truncate">
              <p class="font-bold text-sm text-gray-900">{{ notif.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ notif.message }}</p>
            </td>
            <td class="p-4">
              <span class="px-2 py-1 text-xs font-medium bg-gray-100 rounded uppercase">{{ notif.type }}</span>
            </td>
            <td class="p-4">
              <span v-if="notif.isRead" class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Read</span>
              <span v-else class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Unread</span>
            </td>
            <td class="p-4 text-xs text-gray-500">
              {{ new Date(notif.createdAt).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <span class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50">Prev</button>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </div>

    <!-- Trigger Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Trigger Notification</h3>
          <form @submit.prevent="submitTrigger" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Target User (Optional)</label>
              <select v-model="form.userId" class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand focus:border-brand text-sm">
                <option value="">-- Broadcast to all users (WIP) --</option>
                <option v-for="user in usersList" :key="user._id" :value="user._id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">If unselected, it acts as a broadcast.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="form.title" required class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand focus:border-brand text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea v-model="form.message" required rows="3" class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand focus:border-brand text-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="form.type" class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-brand focus:border-brand text-sm">
                <option value="system">System</option>
                <option value="message">Message</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
              <button type="submit" :disabled="sending" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">{{ sending ? 'Sending...' : 'Send Push' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useSeoMeta } from '#imports';

useSeoMeta({ title: 'Notifications Management | Admin' });

const { showToast } = useCustomToast();
const loading = ref(true);
const notifications = ref<any[]>([]);
const usersList = ref<any[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);

const isModalOpen = ref(false);
const sending = ref(false);
const form = ref({
  userId: '',
  title: '',
  message: '',
  type: 'system'
});

const fetchUsers = async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const res = await axios.get(`http://localhost:4000/api/v1/users/admin/all?limit=1000`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    usersList.value = res.data.users || [];
  } catch (err) {
    console.error('Failed to load users for dropdown', err);
  }
};

const fetchNotifications = async () => {
  loading.value = true;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const res = await axios.get(`http://localhost:4000/api/v1/notifications/admin/all?page=${currentPage.value}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    notifications.value = res.data.items || [];
    totalPages.value = res.data.pages || 1;
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to load notifications', type: 'error' });
  } finally {
    loading.value = false;
  }
};

watch(currentPage, () => {
  fetchNotifications();
});

onMounted(() => {
  fetchNotifications();
  fetchUsers();
});

const submitTrigger = async () => {
  sending.value = true;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    await axios.post('http://localhost:4000/api/v1/notifications/admin/broadcast', form.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showToast({ title: 'Success', message: 'Notification triggered successfully!', type: 'success' });
    isModalOpen.value = false;
    form.value = { userId: '', title: '', message: '', type: 'system' };
    currentPage.value = 1;
    fetchNotifications();
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to trigger notification', type: 'error' });
  } finally {
    sending.value = false;
  }
};
</script>
