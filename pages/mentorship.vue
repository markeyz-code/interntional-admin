<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mentorship Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage mentorship requests, mentors, and categories.</p>
      </div>
      <div v-if="activeTab === 'mentors'">
        <button @click="isMentorModalOpen = true" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
          + Add Mentor
        </button>
      </div>
      <div v-if="activeTab === 'categories'">
        <button @click="isCategoryModalOpen = true" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
          + Add Category
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-4 border-b border-gray-200">
      <button @click="activeTab = 'requests'" :class="[activeTab === 'requests' ? 'text-brand border-brand font-medium' : 'text-gray-500 border-transparent hover:text-gray-700', 'pb-3 px-2 border-b-2 transition-colors']">
        Requests
      </button>
      <button @click="activeTab = 'mentors'" :class="[activeTab === 'mentors' ? 'text-brand border-brand font-medium' : 'text-gray-500 border-transparent hover:text-gray-700', 'pb-3 px-2 border-b-2 transition-colors']">
        Mentors
      </button>
      <button @click="activeTab = 'categories'" :class="[activeTab === 'categories' ? 'text-brand border-brand font-medium' : 'text-gray-500 border-transparent hover:text-gray-700', 'pb-3 px-2 border-b-2 transition-colors']">
        Categories
      </button>
    </div>

    <!-- Requests Tab -->
    <div v-if="activeTab === 'requests'" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <!-- Empty State -->
      <div v-if="loadingRequests" class="p-12 flex justify-center items-center">
        <Loader2 class="w-8 h-8 text-brand animate-spin" />
      </div>
      <div v-else-if="requests.length === 0" class="p-12 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Users class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">No mentorship requests</h3>
        <p class="text-gray-500 text-sm max-w-sm">There are currently no active mentorship requests for this application.</p>
      </div>
      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th class="p-4 font-semibold">User</th>
              <th class="p-4 font-semibold">Area of Interest</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold">Date</th>
              <th class="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="req in requests" :key="req._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-900">{{ req.name }}</span>
                  <span class="text-xs text-gray-500">{{ req.email }}</span>
                </div>
              </td>
              <td class="p-4">
                <span class="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{{ req.areaOfInterest }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize" :class="statusColor(req.status)">
                    {{ req.status }}
                  </span>
                  <span v-if="req.matchedMentor" class="text-xs text-gray-500 truncate max-w-[120px]" :title="req.matchedMentor.name">
                    (with {{ req.matchedMentor.name }})
                  </span>
                </div>
              </td>
              <td class="p-4 text-sm text-gray-500">
                {{ new Date(req.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button @click="openEditModal(req)" class="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-medium transition-colors">
                    Manage
                  </button>
                  <button @click="handleDeleteRequest(req._id)" class="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div v-if="metadata.totalPages > 1" class="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <span class="text-sm text-gray-500">
          Page <span class="font-medium text-gray-900">{{ metadata.page }}</span> of <span class="font-medium text-gray-900">{{ metadata.totalPages }}</span>
        </span>
        <div class="flex items-center gap-2">
          <button @click="changePage(metadata.page - 1)" :disabled="metadata.page === 1" class="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Previous
          </button>
          <button @click="changePage(metadata.page + 1)" :disabled="metadata.page === metadata.totalPages" class="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Mentors Tab -->
    <div v-if="activeTab === 'mentors'" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div v-if="loadingMentors" class="p-12 flex justify-center items-center">
        <Loader2 class="w-8 h-8 text-brand animate-spin" />
      </div>
      <div v-else-if="mentors.length === 0" class="p-12 text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-1">No Mentors configured</h3>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th class="p-4 font-semibold">Avatar</th>
              <th class="p-4 font-semibold">Name & Email</th>
              <th class="p-4 font-semibold">Category/Area</th>
              <th class="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="mentor in mentors" :key="mentor._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <img :src="mentor.avatar || 'https://via.placeholder.com/40'" class="w-10 h-10 rounded-full object-cover" />
              </td>
              <td class="p-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-900">{{ mentor.name }}</span>
                  <span class="text-xs text-gray-500">{{ mentor.email }}</span>
                </div>
              </td>
              <td class="p-4 text-sm text-gray-700">{{ mentor.areaOfInterest }}</td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button @click="openEditMentorModal(mentor)" class="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-medium transition-colors">
                    Edit
                  </button>
                  <button @click="handleDeleteMentor(mentor._id)" class="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div v-if="loadingMentors" class="p-12 flex justify-center items-center">
        <Loader2 class="w-8 h-8 text-brand animate-spin" />
      </div>
      <div v-else-if="categories.length === 0" class="p-12 text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-1">No Categories configured</h3>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th class="p-4 font-semibold">Name</th>
              <th class="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-sm font-medium text-gray-900">{{ cat.name }}</td>
              <td class="p-4">
                <button @click="handleDeleteCategory(cat._id)" class="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Request Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 class="text-lg font-bold text-gray-900">Manage Request</h3>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">User Details</label>
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="font-medium text-gray-900">{{ selectedRequest?.name }}</div>
                <div class="text-sm text-gray-500">{{ selectedRequest?.email }}</div>
                <div class="mt-2 text-sm">
                  <span class="font-medium text-gray-700">Interest:</span> 
                  <span class="ml-1 px-2 py-0.5 bg-brand/10 text-brand rounded text-xs font-medium">{{ selectedRequest?.areaOfInterest }}</span>
                </div>
              </div>
            </div>

            <!-- Custom Mentor Select -->
            <div class="relative">
              <label class="block text-sm font-semibold text-gray-700 mb-1 flex justify-between">
                <span>Assign Mentor</span>
                <span v-if="selectedRequest?.matchedMentor" class="text-xs text-green-600 font-medium">Currently Assigned</span>
              </label>
              
              <div class="relative">
                <button type="button" @click="isMentorDropdownOpen = !isMentorDropdownOpen" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-left flex justify-between items-center focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all">
                  <span v-if="editForm.matchedMentor">{{ mentors.find(m => m._id === editForm.matchedMentor)?.name || 'Unknown Mentor' }}</span>
                  <span v-else class="text-gray-400">-- Select a Mentor --</span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div v-if="isMentorDropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  <div @click="selectMentor('')" class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-500 italic border-b border-gray-100">
                    -- Clear Assignment --
                  </div>
                  
                  <div class="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">Recommended</div>
                  <div v-for="mentor in mentors.filter(m => m.areaOfInterest === selectedRequest?.areaOfInterest)" :key="mentor._id" 
                       @click="selectMentor(mentor._id)"
                       class="px-3 py-2 hover:bg-brand/5 cursor-pointer text-sm border-b border-gray-50 flex items-center justify-between">
                    <span class="font-medium text-gray-900">{{ mentor.name }}</span>
                    <span class="text-xs text-brand bg-brand/10 px-2 rounded-full">{{ mentor.areaOfInterest }}</span>
                  </div>

                  <div class="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 mt-2">Other Mentors</div>
                  <div v-for="mentor in mentors.filter(m => m.areaOfInterest !== selectedRequest?.areaOfInterest)" :key="'other-'+mentor._id" 
                       @click="selectMentor(mentor._id)"
                       class="px-3 py-2 hover:bg-brand/5 cursor-pointer text-sm border-b border-gray-50 flex items-center justify-between">
                    <span class="text-gray-700">{{ mentor.name }}</span>
                    <span class="text-xs text-gray-400 bg-gray-100 px-2 rounded-full">{{ mentor.areaOfInterest }}</span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Assigning a mentor will automatically update the status to "Matched" if it is currently pending.</p>
            </div>

            <!-- Selected Mentor Preview -->
            <div v-if="selectedMentorDetails" class="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-2">
              <h4 class="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">Mentor Preview</h4>
              <div class="flex items-start gap-4">
                <img :src="selectedMentorDetails.avatar || 'https://via.placeholder.com/60'" class="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                <div>
                  <div class="font-bold text-gray-900">{{ selectedMentorDetails.name }}</div>
                  <div class="text-xs text-brand font-medium mb-1">{{ selectedMentorDetails.areaOfInterest }}</div>
                  <div class="text-sm text-gray-600 line-clamp-3 leading-relaxed">{{ selectedMentorDetails.bio || 'No biography provided for this mentor.' }}</div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select v-model="editForm.status" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all">
                <option value="pending">Pending</option>
                <option value="matched">Matched</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Admin Notes</label>
              <textarea v-model="editForm.notes" rows="3" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Add notes about this match..."></textarea>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="handleUpdate" :disabled="updateLoading" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
            <Loader2 v-if="updateLoading" class="w-4 h-4 animate-spin" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Mentor Modal -->
    <UiModal :isOpen="isMentorModalOpen" title="Add Mentor" @close="isMentorModalOpen = false">
      <form @submit.prevent="handleAddMentor" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="mentorForm.name" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="mentorForm.email" required type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Area of Interest / Category</label>
          <select v-model="mentorForm.areaOfInterest" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand">
            <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
          <input type="file" accept="image/*" @change="handleAvatarUpload" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          <div v-if="uploadingAvatar" class="text-xs text-brand mt-1 flex items-center gap-1"><Loader2 class="w-3 h-3 animate-spin"/> Uploading...</div>
          <div v-if="avatarPreview" class="mt-2 relative inline-block">
             <img :src="avatarPreview" class="w-16 h-16 rounded object-cover border border-gray-200" />
             <button type="button" @click="removeAvatar" class="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow border border-gray-200 hover:bg-gray-100"><X class="w-3 h-3 text-red-500"/></button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea v-model="mentorForm.bio" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand"></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="isMentorModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="loadingMentors || uploadingAvatar" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 disabled:opacity-50">
            {{ loadingMentors ? 'Saving...' : 'Save Mentor' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Edit Mentor Modal -->
    <UiModal :isOpen="isEditMentorModalOpen" title="Edit Mentor" @close="isEditMentorModalOpen = false">
      <form @submit.prevent="handleEditMentor" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="editMentorForm.name" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="editMentorForm.email" required type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Area of Interest / Category</label>
          <select v-model="editMentorForm.areaOfInterest" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand">
            <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
          <input type="file" accept="image/*" @change="handleEditAvatarUpload" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          <div v-if="uploadingAvatar" class="text-xs text-brand mt-1 flex items-center gap-1"><Loader2 class="w-3 h-3 animate-spin"/> Uploading...</div>
          <div v-if="editAvatarPreview" class="mt-2 relative inline-block">
             <img :src="editAvatarPreview" class="w-16 h-16 rounded object-cover border border-gray-200" />
             <button type="button" @click="removeEditAvatar" class="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow border border-gray-200 hover:bg-gray-100"><X class="w-3 h-3 text-red-500"/></button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea v-model="editMentorForm.bio" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand"></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="isEditMentorModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="loadingMentors || uploadingAvatar" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 disabled:opacity-50">
            {{ loadingMentors ? 'Saving...' : 'Update Mentor' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Add Category Modal -->
    <UiModal :isOpen="isCategoryModalOpen" title="Add Category" @close="isCategoryModalOpen = false">
      <form @submit.prevent="handleAddCategory" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input v-model="categoryForm.name" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="isCategoryModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="loadingMentors" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 disabled:opacity-50">
            {{ loadingMentors ? 'Saving...' : 'Save Category' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useSeoMeta, useHead } from '#imports';
import { Loader2, Users, X } from 'lucide-vue-next';
import { useGetMentorships } from '@/composables/modules/mentorship/useGetMentorships';
import { useUpdateMentorship } from '@/composables/modules/mentorship/useUpdateMentorship';
import { useBusinessContext } from '@/composables/core/useBusinessContext';
import { useManageMentors } from '@/composables/modules/mentorship/useManageMentors';
import { useCustomModal } from '@/composables/core/useCustomModal';
import UiModal from '@/components/ui/Modal.vue';
import { storageApi } from '@/api_factory/modules/storage';
import axios from 'axios';
import { useCustomToast } from '@/composables/core/useCustomToast';

useSeoMeta({ title: 'Mentorship | Admin' });
useHead({ title: 'Mentorship | Admin' });

const { requests, loading: loadingRequests, metadata, fetchRequests } = useGetMentorships();
const { updateStatus, deleteRequest, loading: updateLoading } = useUpdateMentorship();
const { activeBusiness } = useBusinessContext();
const { mentors, categories, loading: loadingMentors, fetchMentors, createMentor, updateMentor, deleteMentor, fetchCategories, createCategory, deleteCategory } = useManageMentors();
const { showToast } = useCustomToast();

const activeTab = ref('requests');

// Modals
const isModalOpen = ref(false);
const isMentorModalOpen = ref(false);
const isEditMentorModalOpen = ref(false);
const isCategoryModalOpen = ref(false);

const selectedRequest = ref<any>(null);
const editForm = ref({ status: '', notes: '', matchedMentor: '' });
const isMentorDropdownOpen = ref(false);

const selectMentor = (id: string) => {
  editForm.value.matchedMentor = id;
  isMentorDropdownOpen.value = false;
};

const selectedMentorDetails = computed(() => {
  if (!editForm.value.matchedMentor) return null;
  return mentors.value.find((m: any) => m._id === editForm.value.matchedMentor) || null;
});

const mentorForm = ref({ name: '', email: '', areaOfInterest: '', bio: '', avatar: '' });
const categoryForm = ref({ name: '' });
const uploadingAvatar = ref(false);
const avatarPreview = ref('');
const avatarFile = ref<File | null>(null);

const editMentorId = ref<string | null>(null);
const editMentorForm = ref({ name: '', email: '', areaOfInterest: '', bio: '', avatar: '' });
const editAvatarPreview = ref('');
const editAvatarFile = ref<File | null>(null);

const removeAvatar = () => {
  avatarPreview.value = '';
  avatarFile.value = null;
  mentorForm.value.avatar = '';
};

onMounted(() => {
  fetchRequests(1);
  fetchMentors();
  fetchCategories();
});

watch(activeBusiness, () => {
  fetchRequests(1);
});

const changePage = (page: number) => {
  fetchRequests(page);
};

const statusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'matched': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const openEditModal = (req: any) => {
  selectedRequest.value = req;
  editForm.value = {
    status: req.status || 'pending',
    notes: req.notes || '',
    matchedMentor: req.matchedMentor?._id || req.matchedMentor || ''
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRequest.value = null;
};

const handleUpdate = async () => {
  if (!selectedRequest.value) return;
  
  // Auto-update status to 'matched' if a mentor is selected and status is 'pending'
  let finalStatus = editForm.value.status;
  if (editForm.value.matchedMentor && finalStatus === 'pending') {
    finalStatus = 'matched';
  }

  const payload: any = {
    status: finalStatus,
    notes: editForm.value.notes
  };

  if (editForm.value.matchedMentor) {
    payload.matchedMentor = editForm.value.matchedMentor;
  } else {
    // If we are unassigning a mentor, we might need a way to clear it, 
    // but typically MongoDB updates omit undefined. For now, pass null if unassigned.
    payload.matchedMentor = null; 
  }

  const success = await updateStatus(selectedRequest.value._id, payload);
  if (success) {
    closeModal();
    fetchRequests(metadata.value.page);
  }
};

const { confirm: modalConfirm } = useCustomModal();

const handleDeleteRequest = async (id: string) => {
  const confirmed = await modalConfirm({
    title: 'Delete Mentorship Request',
    message: 'Are you sure you want to delete this mentorship request? This action cannot be undone.',
    confirmText: 'Delete Request',
    cancelText: 'Cancel',
    type: 'danger',
  });
  if (confirmed) {
    const success = await deleteRequest(id);
    if (success) {
      fetchRequests(metadata.value.page);
    }
  }
};

const handleDeleteMentor = async (id: string) => {
  const confirmed = await modalConfirm({
    title: 'Delete Mentor',
    message: 'Are you sure you want to delete this mentor?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
  });
  if (confirmed) {
    await deleteMentor(id);
  }
};

const handleDeleteCategory = async (id: string) => {
  const confirmed = await modalConfirm({
    title: 'Delete Category',
    message: 'Are you sure you want to delete this category?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
  });
  if (confirmed) {
    await deleteCategory(id);
  }
};

const handleAddCategory = async () => {
  const success = await createCategory({ name: categoryForm.value.name });
  if (success) {
    categoryForm.value.name = '';
    isCategoryModalOpen.value = false;
  }
};

const handleAddMentor = async () => {
  if (avatarFile.value) {
    uploadingAvatar.value = true;
    try {
      const { data: sigData } = await storageApi.getUploadSignature();
      const formData = new FormData();
      formData.append('file', avatarFile.value);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      if (sigData.folder) formData.append('folder', sigData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
      const { data: uploadResult } = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      mentorForm.value.avatar = uploadResult.secure_url;
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast({ title: 'Error', message: 'Failed to upload image.', type: 'error' });
      uploadingAvatar.value = false;
      return;
    }
  }

  const success = await createMentor(mentorForm.value);
  if (success) {
    mentorForm.value = { name: '', email: '', areaOfInterest: '', bio: '', avatar: '' };
    avatarPreview.value = '';
    avatarFile.value = null;
    isMentorModalOpen.value = false;
  }
  uploadingAvatar.value = false;
};

const handleAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  
  const file = target.files[0];
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const openEditMentorModal = (mentor: any) => {
  editMentorId.value = mentor._id;
  editMentorForm.value = {
    name: mentor.name,
    email: mentor.email,
    areaOfInterest: mentor.areaOfInterest,
    bio: mentor.bio || '',
    avatar: mentor.avatar || ''
  };
  editAvatarPreview.value = mentor.avatar || '';
  editAvatarFile.value = null;
  isEditMentorModalOpen.value = true;
};

const removeEditAvatar = () => {
  editAvatarPreview.value = '';
  editAvatarFile.value = null;
  editMentorForm.value.avatar = '';
};

const handleEditAvatarUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  
  const file = target.files[0];
  editAvatarFile.value = file;
  editAvatarPreview.value = URL.createObjectURL(file);
};

const handleEditMentor = async () => {
  if (!editMentorId.value) return;

  if (editAvatarFile.value) {
    uploadingAvatar.value = true;
    try {
      const { data: sigData } = await storageApi.getUploadSignature();
      const formData = new FormData();
      formData.append('file', editAvatarFile.value);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      if (sigData.folder) formData.append('folder', sigData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
      const { data: uploadResult } = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      editMentorForm.value.avatar = uploadResult.secure_url;
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast({ title: 'Error', message: 'Failed to upload image.', type: 'error' });
      uploadingAvatar.value = false;
      return;
    }
  }

  const success = await updateMentor(editMentorId.value, editMentorForm.value);
  if (success) {
    isEditMentorModalOpen.value = false;
  }
  uploadingAvatar.value = false;
};
</script>
