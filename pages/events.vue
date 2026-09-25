<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Events</h1>
        <p class="text-sm text-gray-500 mt-1">Manage platform events, webinars and track registrations.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Create Event
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Cancelled', value: 'cancelled' }
      ]"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Data List -->
    <div v-else-if="filteredEvents.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th class="p-4">Title</th>
            <th class="p-4">Date</th>
            <th class="p-4">Type</th>
            <th class="p-4">Registrations</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="evt in filteredEvents" :key="evt._id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4">
              <div class="font-medium text-gray-900">{{ evt.title }}</div>
              <div v-if="evt.location" class="text-xs text-gray-400 mt-0.5">📍 {{ evt.location }}</div>
            </td>
            <td class="p-4 text-gray-500 text-sm">{{ new Date(evt.date).toLocaleString() }}</td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider" :class="{
                'bg-green-100 text-green-700': evt.type === 'in-person',
                'bg-purple-100 text-purple-700': evt.type === 'virtual',
                'bg-blue-100 text-blue-700': evt.type === 'hybrid'
              }">
                {{ evt.type || 'in-person' }}
              </span>
            </td>
            <td class="p-4">
              <button @click="viewRegistrations(evt)" class="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {{ regCounts[evt._id] || 0 }} {{ evt.capacity ? `/ ${evt.capacity}` : '' }}
              </button>
            </td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider" :class="{
                'bg-blue-100 text-blue-700': evt.status === 'upcoming',
                'bg-gray-100 text-gray-700': evt.status === 'past',
                'bg-red-100 text-red-700': evt.status === 'cancelled'
              }">
                {{ evt.status }}
              </span>
            </td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="copyEventLink(evt)" class="text-sm font-medium text-green-600 hover:text-green-800 transition-colors" title="Copy Share Link">🔗</button>
                <button @click="openEditModal(evt)" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                <button @click="openDeleteModal(evt)" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Events Found</h3>
        <p class="text-gray-500 mt-1">There are no events scheduled on the platform.</p>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <UiModal :isOpen="isModalOpen" :title="isEdit ? 'Edit Event' : 'Create Event'" @close="isModalOpen = false">
      <form @submit.prevent="saveEvent" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input v-model="form.title" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
            <input v-model="form.date" required type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input v-model="form.endDate" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input v-model="form.location" type="text" placeholder="e.g. Main Auditorium" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
            <input v-model="form.speaker" type="text" placeholder="e.g. Dr. Jane Doe" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiSelect id="evt-type" v-model="form.type" label="Event Type *" :options="[{ label: 'In-Person', value: 'in-person' }, { label: 'Virtual', value: 'virtual' }, { label: 'Hybrid', value: 'hybrid' }]" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Capacity (0 = unlimited)</label>
            <input v-model.number="form.capacity" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div v-if="form.type === 'virtual' || form.type === 'hybrid'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
          <input v-model="form.meetingLink" type="url" placeholder="https://zoom.us/j/..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input v-model="form.coverImage" type="url" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiSelect id="evt-status" v-model="form.status" label="Status *" :options="[{ label: 'Upcoming', value: 'upcoming' }, { label: 'Past', value: 'past' }, { label: 'Cancelled', value: 'cancelled' }]" required />
          </div>
          <div class="flex items-end pb-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.registrationOpen" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm font-medium text-gray-700">Registration Open</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="isSaving" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Registrations Modal -->
    <UiModal :isOpen="isRegModalOpen" :title="`Registrations — ${activeItem?.title || ''}`" @close="isRegModalOpen = false">
      <div class="space-y-4 px-2 pb-4">
        <div v-if="regLoading" class="flex justify-center py-8">
          <div class="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="registrations.length === 0" class="text-center py-8 text-gray-500 text-sm">No registrations yet for this event.</div>
        <div v-else>
          <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-bold text-gray-900">{{ registrations.length }} Registered</span>
            <span v-if="activeItem?.capacity" class="text-xs text-gray-500">Capacity: {{ activeItem.capacity }}</span>
          </div>
          <div class="max-h-[50vh] overflow-y-auto space-y-2">
            <div v-for="reg in registrations" :key="reg._id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <div class="font-medium text-gray-900 text-sm">{{ reg.fullName }}</div>
                <div class="text-xs text-gray-500">{{ reg.email }} {{ reg.phone ? `• ${reg.phone}` : '' }}</div>
                <div v-if="reg.university" class="text-xs text-gray-400 mt-0.5">{{ reg.university }} {{ reg.programme ? `— ${reg.programme}` : '' }}</div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">{{ reg.status }}</span>
                <button @click="removeRegistration(reg._id)" class="text-red-500 hover:bg-red-100 p-1 rounded transition-colors" title="Remove">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="isRegModalOpen = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors">Close</button>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal :isOpen="isDeleteModalOpen" title="Confirm Delete" @close="isDeleteModalOpen = false">
      <div class="space-y-4 px-2 pb-4">
        <p class="text-sm text-gray-600">Are you sure you want to delete <strong>{{ activeItem?.title }}</strong>? This will also delete all registrations. This action cannot be undone.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isDeleteModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button @click="deleteEvent" :disabled="isDeleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSeoMeta } from '#imports';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiModal from '@/components/ui/Modal.vue';
import UiSelect from '@/components/ui/Select.vue';
import { eventsApi } from '@/api_factory/modules/events';
import { useCustomToast } from '@/composables/core/useCustomToast';

useSeoMeta({ title: 'Events - Admin Dashboard' });

const { showToast } = useCustomToast();
const filters = ref({ search: '', status: '', role: '', startDate: '', endDate: '' });
const events = ref<any[]>([]);
const loading = ref(true);
const regCounts = ref<Record<string, number>>({});

// Modals state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isRegModalOpen = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const regLoading = ref(false);
const activeItem = ref<any>(null);
const registrations = ref<any[]>([]);

const form = ref({
  title: '',
  description: '',
  date: '',
  endDate: '',
  location: '',
  speaker: '',
  type: 'in-person',
  meetingLink: '',
  capacity: 0,
  coverImage: '',
  status: 'upcoming',
  registrationOpen: true,
});

const filteredEvents = computed(() => {
  return events.value.filter(evt => {
    if (filters.value.search && !evt.title?.toLowerCase().includes(filters.value.search.toLowerCase())) return false;
    if (filters.value.status && evt.status !== filters.value.status) return false;
    if (filters.value.startDate || filters.value.endDate) {
      const date = new Date(evt.date);
      if (filters.value.startDate && date < new Date(filters.value.startDate)) return false;
      if (filters.value.endDate) {
        const end = new Date(filters.value.endDate);
        end.setHours(23, 59, 59, 999);
        if (date > end) return false;
      }
    }
    return true;
  });
});

const fetchEvents = async () => {
  try {
    loading.value = true;
    const response = await eventsApi.getEvents();
    events.value = response.data || response;
    
    // Fetch registration counts
    const countsRes = await eventsApi.getRegistrationCounts();
    const countsData = countsRes.data || countsRes;
    regCounts.value = {};
    countsData.forEach((c: any) => { regCounts.value[c._id] = c.count; });
  } catch (err) {
    console.error('Failed to fetch events', err);
  } finally {
    loading.value = false;
  }
};

const getEventShareUrl = (evt: any) => {
  const slug = evt.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'event';
  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://universe.medlabconvo.com';
  return `${baseUrl}/events/${slug}-${evt._id}`;
};

const copyEventLink = async (evt: any) => {
  const url = getEventShareUrl(evt);
  try {
    await navigator.clipboard.writeText(url);
    showToast({ title: 'Link Copied!', message: 'Event registration link copied to clipboard.', type: 'success' });
  } catch (e) {
    showToast({ title: 'Failed', message: 'Could not copy link.', type: 'error' });
  }
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = { title: '', description: '', date: '', endDate: '', location: '', speaker: '', type: 'in-person', meetingLink: '', capacity: 0, coverImage: '', status: 'upcoming', registrationOpen: true };
  isModalOpen.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  activeItem.value = item;
  const formatDate = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : '';
  form.value = { 
    title: item.title,
    description: item.description || '',
    date: formatDate(item.date),
    endDate: formatDate(item.endDate),
    location: item.location || '',
    speaker: item.speaker || '',
    type: item.type || 'in-person',
    meetingLink: item.meetingLink || '',
    capacity: item.capacity || 0,
    coverImage: item.coverImage || '',
    status: item.status,
    registrationOpen: item.registrationOpen !== false,
  };
  isModalOpen.value = true;
};

const openDeleteModal = (item: any) => {
  activeItem.value = item;
  isDeleteModalOpen.value = true;
};

const viewRegistrations = async (evt: any) => {
  activeItem.value = evt;
  isRegModalOpen.value = true;
  regLoading.value = true;
  try {
    const res = await eventsApi.getRegistrations(evt._id);
    registrations.value = res.data || res;
  } catch (err) {
    console.error('Failed to fetch registrations', err);
  } finally {
    regLoading.value = false;
  }
};

const removeRegistration = async (regId: string) => {
  try {
    await eventsApi.deleteRegistration(regId);
    registrations.value = registrations.value.filter(r => r._id !== regId);
    showToast({ title: 'Removed', message: 'Registration removed.', type: 'success' });
    fetchEvents(); // refresh counts
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to remove registration.', type: 'error' });
  }
};

const saveEvent = async () => {
  try {
    isSaving.value = true;
    if (isEdit.value) {
      await eventsApi.updateEvent(activeItem.value._id, form.value);
      showToast({ title: 'Success', message: 'Event updated successfully', type: 'success' });
    } else {
      await eventsApi.createEvent(form.value);
      showToast({ title: 'Success', message: 'Event created successfully', type: 'success' });
    }
    isModalOpen.value = false;
    fetchEvents();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save event', type: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const deleteEvent = async () => {
  try {
    isDeleting.value = true;
    await eventsApi.deleteEvent(activeItem.value._id);
    showToast({ title: 'Success', message: 'Event deleted successfully', type: 'success' });
    isDeleteModalOpen.value = false;
    fetchEvents();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete event', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>
