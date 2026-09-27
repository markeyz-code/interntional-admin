<template>
  <div class="space-y-6 pb-10 w-full">
    <!-- Header -->
    <div class="flex items-center gap-4 border-b border-gray-200 pb-4">
      <NuxtLink to="/users" class="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          {{ user?.firstName }} {{ user?.lastName }}
          <span v-if="user?.status === 'APPROVED'" class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Active</span>
          <span v-else-if="user?.status === 'PENDING'" class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">Pending</span>
          <span v-else class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">{{ user?.status }}</span>
        </h1>
        <p class="text-gray-500 font-medium mt-1">{{ user?.email }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-gray-200 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-3 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap"
        :class="activeTab === tab.id ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'"
      >
        {{ tab.name }}
      </button>
    </div>

    <div v-if="loading" class="py-20 flex justify-center">
      <RefreshCw class="w-8 h-8 text-brand animate-spin" />
    </div>

    <div v-else-if="user" class="space-y-8">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-gray-900 border-b pb-3">Personal Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.firstName }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.lastName }}</p>
            </div>
            <div class="sm:col-span-2 md:col-span-1">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
              <p class="font-medium text-gray-900 mt-1 break-all">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.phoneNumber || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.country || 'N/A' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-gray-900 border-b pb-3">Professional Info</h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</p>
              <p class="font-medium text-gray-900 mt-1">{{ (user.department || '').replace(/_/g, ' ') || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">University ID</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.universityId || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Programme ID</p>
              <p class="font-medium text-gray-900 mt-1">{{ user.programmeId || 'N/A' }}</p>
            </div>
            <div v-if="user.permissions && user.permissions.length > 0">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="perm in user.permissions" :key="perm" class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold uppercase">
                  {{ perm.replace(/_/g, ' ') }}
                </span>
              </div>
            </div>
            <div v-else>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions</p>
              <p class="font-medium text-gray-500 mt-1 text-sm italic">No specific permissions granted.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Tab -->
      <div v-if="activeTab === 'documents'" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Verification Document</h3>
        <div v-if="user.verificationFileUrl" class="max-w-xl mx-auto border rounded-xl overflow-hidden bg-gray-50 p-4">
          <div class="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-4 shadow-inner relative flex items-center justify-center">
             <template v-if="user.verificationFileUrl.endsWith('.pdf')">
                <div class="text-center">
                  <FileText class="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500 font-medium">PDF Document</p>
                </div>
             </template>
             <template v-else>
               <img :src="user.verificationFileUrl" class="object-contain w-full h-full" alt="Verification" />
             </template>
          </div>
          <div class="flex justify-between items-center">
            <a :href="user.verificationFileUrl" target="_blank" class="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
              <ExternalLink class="w-4 h-4" /> Open Original
            </a>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-500 font-medium">
          No verification document provided.
        </div>
      </div>

      <!-- Subscriptions Tab -->
      <div v-if="activeTab === 'subscriptions'" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Subscription Status</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <div class="border rounded-xl p-5 bg-gray-50">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Plan</p>
             <p class="font-black text-gray-900 text-lg">{{ user.activeSubscription?.name || 'None' }}</p>
           </div>
           <div class="border rounded-xl p-5 bg-gray-50">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
             <p class="font-black text-gray-900 text-lg">
               {{ user.activeSubscription?.price ? `₦${(user.activeSubscription.price / 100).toLocaleString()}` : 'Free' }}
             </p>
           </div>
           <div class="border rounded-xl p-5 bg-gray-50">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
             <p class="font-black text-gray-900 text-lg">
               {{ user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString() : 'N/A' }}
             </p>
           </div>
           <div class="border rounded-xl p-5 bg-gray-50">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subscription Status</p>
             <p class="font-black text-gray-900 text-lg flex items-center gap-2">
               <span v-if="user.isSubscriptionActive" class="w-3 h-3 rounded-full bg-green-500"></span>
               <span v-else class="w-3 h-3 rounded-full bg-red-500"></span>
               {{ user.isSubscriptionActive ? 'Active' : 'Inactive' }}
             </p>
           </div>
           
           <div class="border rounded-xl p-5 bg-gray-50 sm:col-span-2 lg:col-span-3" v-if="user.activeSubscription?.features?.length > 0">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Plan Features</p>
             <ul class="space-y-2">
               <li v-for="feature in user.activeSubscription.features" :key="feature" class="flex items-start gap-2 text-sm text-gray-700 font-medium">
                 <Check class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {{ feature }}
               </li>
             </ul>
           </div>
        </div>
      </div>

      <!-- Actions Tab -->
      <div v-if="activeTab === 'actions'" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 class="text-lg font-bold text-gray-900 border-b pb-3">User Actions</h3>
        
        <div class="flex flex-col gap-4 max-w-sm">
          <button 
            v-if="user.status === 'PENDING'"
            @click="handleApprove"
            :disabled="actionLoading"
            class="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Check class="w-5 h-5" /> Approve Application
          </button>
          
          <button 
            v-if="user.status === 'PENDING'"
            @click="handleReject"
            :disabled="actionLoading"
            class="w-full py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <X class="w-5 h-5" /> Reject Application
          </button>
          
          <button 
            v-if="user.status === 'APPROVED'"
            @click="handleRevoke"
            :disabled="actionLoading"
            class="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Ban class="w-5 h-5" /> Revoke Access
          </button>
        </div>
      </div>

    </div>
    
    <div v-else class="py-20 text-center text-gray-500 font-medium">
      User not found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, RefreshCw, FileText, ExternalLink, Check, X, Ban } from 'lucide-vue-next';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

const route = useRoute();
const userId = route.params.id as string;
const { showToast } = useCustomToast();

const user = ref<any>(null);
const loading = ref(true);
const actionLoading = ref(false);

const activeTab = ref('overview');
const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'documents', name: 'Documents' },
  { id: 'subscriptions', name: 'Subscriptions' },
  { id: 'actions', name: 'Actions' },
];

const fetchUser = async () => {
  loading.value = true;
  try {
    const res = await usersApi.getUserById(userId);
    user.value = res.data;
  } catch (err: any) {
    showToast({ title: 'Error', message: 'Failed to fetch user details', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const handleApprove = async () => {
  actionLoading.value = true;
  try {
    await usersApi.approveUser(userId);
    showToast({ title: 'Success', message: 'User approved successfully', type: 'success' });
    await fetchUser();
  } catch (err: any) {
    showToast({ title: 'Error', message: 'Failed to approve user', type: 'error' });
  } finally {
    actionLoading.value = false;
  }
};

const handleReject = async () => {
  actionLoading.value = true;
  try {
    await usersApi.rejectUser(userId);
    showToast({ title: 'Success', message: 'User rejected successfully', type: 'success' });
    await fetchUser();
  } catch (err: any) {
    showToast({ title: 'Error', message: 'Failed to reject user', type: 'error' });
  } finally {
    actionLoading.value = false;
  }
};

const handleRevoke = async () => {
  actionLoading.value = true;
  try {
    await usersApi.revokeUser(userId);
    showToast({ title: 'Success', message: 'User access revoked', type: 'success' });
    await fetchUser();
  } catch (err: any) {
    showToast({ title: 'Error', message: 'Failed to revoke access', type: 'error' });
  } finally {
    actionLoading.value = false;
  }
};

onMounted(() => {
  fetchUser();
});
</script>
