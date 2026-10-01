<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Forms Management</h1>
        <p class="text-sm text-gray-500 mt-1">Build custom forms for events, call for papers, article submissions, surveys and more.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200">
          <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="p-1.5 rounded-md transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'" class="p-1.5 rounded-md transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          </button>
        </div>
        <button @click="openFormBuilder" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
          + Create Form
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Forms List/Grid -->
    <div v-else-if="forms.length > 0" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'">
      <div v-for="form in forms" :key="form._id" :class="viewMode === 'grid' ? 'flex-col' : 'flex-row items-stretch'" class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group flex">
        <div :class="[viewMode === 'grid' ? 'h-2 w-full' : 'w-2 h-auto', formTypeColor(form.type)]"></div>
        <div class="p-5 flex-1" :class="viewMode === 'grid' ? '' : 'flex flex-col justify-center'">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" :class="formStatusClass(form.status)">{{ form.status }}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ formTypeLabel(form.type) }}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-base mb-1 line-clamp-1">{{ form.title }}</h3>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ form.description || 'No description' }}</p>
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>{{ form.fields?.length || 0 }} fields</span>
            <button @click="viewSubmissions(form)" class="font-medium text-brand hover:underline flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              {{ subCounts[form._id] || 0 }} responses
            </button>
          </div>
        </div>
        <div :class="viewMode === 'grid' ? 'border-t px-5 py-3 justify-between' : 'border-l px-6 py-4 flex-col justify-center'" class="border-gray-100 flex items-center bg-gray-50/50 gap-5 min-w-[150px]">
          <button @click="copyFormLink(form)" class="text-xs font-medium text-green-600 hover:text-green-800 transition-colors flex gap-1 items-center">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Copy Link
          </button>
          <div class="flex items-center gap-3">
            <button @click="editForm(form)" class="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
            <button @click="confirmDeleteForm(form)" class="text-xs font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <div class="w-16 h-16 bg-brand/5 text-brand rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">No Forms Created</h3>
      <p class="text-gray-500 text-sm">Create your first form to start collecting submissions.</p>
    </div>

    <!-- ===================== FORM BUILDER FULL-SCREEN ===================== -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="isBuilderOpen" class="fixed inset-0 z-[9999] bg-gray-50 overflow-y-auto">
          <form @submit.prevent="saveForm">
            <!-- Top Bar -->
            <div class="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
              <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <button type="button" @click="isBuilderOpen = false" class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Back to Forms
                </button>
                <div class="flex items-center gap-3">
                  <button type="submit" :disabled="savingForm" class="px-5 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#1f4e70] transition-colors shadow-sm disabled:opacity-50">
                    {{ savingForm ? 'Saving...' : (isEditMode ? 'Update Form' : 'Create Form') }}
                  </button>
                </div>
              </div>
            </div>

          <!-- Builder Content -->
          <div class="max-w-6xl mx-auto px-6 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left: Form Settings -->
              <div class="lg:col-span-1 space-y-6">
                <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 class="font-bold text-gray-900 mb-4">Form Settings</h2>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Form Title *</label>
                      <input v-model="formData.title" required type="text" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm" placeholder="e.g. Call for Papers 2026" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea v-model="formData.description" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm" rows="3" placeholder="What is this form for?"></textarea>
                    </div>
                    <div>
                      <UiSelect id="form-type" v-model="formData.type" label="Form Type *" :options="formTypeOptions" required />
                    </div>
                    <div>
                      <UiSelect id="form-status" v-model="formData.status" label="Status *" :options="[{ label: 'Draft', value: 'draft' }, { label: 'Active', value: 'active' }, { label: 'Closed', value: 'closed' }]" required />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                      <input v-model="formData.deadline" type="datetime-local" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max Submissions (0 = unlimited)</label>
                      <input v-model.number="formData.maxSubmissions" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
                      <input v-model="formData.successMessage" type="text" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand text-sm" placeholder="Thank you for your submission!" />
                    </div>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="formData.allowMultipleSubmissions" class="rounded border-gray-300 text-brand focus:ring-brand" />
                      <span class="text-sm font-medium text-gray-700">Allow Multiple Submissions</span>
                    </label>

                    <!-- Cover Image Upload -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                      <div class="relative w-full h-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-brand/50 transition-all cursor-pointer group overflow-hidden" @click="($refs as any).coverInput?.click()">
                        <img v-if="formData.coverImage || formData.coverImagePreview" :src="formData.coverImagePreview || formData.coverImage" class="absolute inset-0 w-full h-full object-cover z-10" />
                        <div v-if="formData.coverImage || formData.coverImagePreview" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                          <span class="text-white text-xs font-bold">Change Image</span>
                        </div>
                        <template v-if="!(formData.coverImage || formData.coverImagePreview)">
                          <svg v-if="!uploadingCover" class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          <p v-if="!uploadingCover" class="text-xs text-gray-400">Click to upload</p>
                          <div v-if="uploadingCover" class="flex flex-col items-center">
                            <div class="w-8 h-8 border-3 border-brand/20 border-t-brand rounded-full animate-spin mb-2"></div>
                            <p class="text-xs text-brand font-medium">{{ coverProgress }}%</p>
                          </div>
                        </template>
                      </div>
                      <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
                      <button v-if="formData.coverImage || formData.coverImagePreview" @click.prevent="formData.coverImage = ''; formData.coverImagePreview = ''; formData.coverImageFile = null;" type="button" class="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">Remove Image</button>
                    </div>
                  </div>
                </div>

                <!-- Quick Templates -->
                <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 class="font-bold text-gray-900 mb-3 text-sm">Quick Templates</h3>
                  <div class="space-y-2">
                    <button v-for="t in templates" :key="t.type" @click="applyTemplate(t)" class="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-all text-sm">
                      <span class="font-medium text-gray-900">{{ t.label }}</span>
                      <span class="block text-xs text-gray-400 mt-0.5">{{ t.desc }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Right: Field Builder -->
              <div class="lg:col-span-2 space-y-6">
                <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="font-bold text-gray-900">Form Fields ({{ formData.fields.length }})</h2>
                    <button @click="addField" class="px-3 py-1.5 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors">+ Add Field</button>
                  </div>

                  <div v-if="formData.fields.length === 0" class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <p class="text-gray-400 text-sm mb-3">No fields added yet. Add fields or use a template.</p>
                    <button @click="addField" class="px-4 py-2 bg-brand/10 text-brand rounded-lg text-sm font-medium hover:bg-brand/20 transition-colors">+ Add First Field</button>
                  </div>

                  <div v-else class="space-y-4">
                    <div v-for="(field, idx) in formData.fields" :key="idx" class="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-colors group relative">
                      <div class="flex items-start justify-between mb-3">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Field {{ idx + 1 }}</span>
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button v-if="idx > 0" @click="moveField(idx, -1)" class="p-1 hover:bg-gray-200 rounded text-gray-500" title="Move Up">↑</button>
                          <button v-if="idx < formData.fields.length - 1" @click="moveField(idx, 1)" class="p-1 hover:bg-gray-200 rounded text-gray-500" title="Move Down">↓</button>
                          <button @click="removeField(idx)" class="p-1 hover:bg-red-100 rounded text-red-500" title="Remove">✕</button>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Label *</label>
                          <input v-model="field.label" type="text" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="Field label" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Type</label>
                          <UiSelect :id="`field-type-${idx}`" v-model="field.type" :options="fieldTypeOptions" inputClass="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand bg-white" />
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Placeholder</label>
                          <input v-model="field.placeholder" type="text" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="Placeholder text" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Help Text</label>
                          <input v-model="field.helpText" type="text" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="Optional hint" />
                        </div>
                      </div>
                      <!-- Options for select/radio/checkbox -->
                      <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" class="mt-3">
                        <label class="block text-[11px] font-medium text-gray-500 mb-1">Options (comma separated)</label>
                        <input :value="(field.options || []).join(', ')" @input="field.options = ($event.target as HTMLInputElement).value.split(',').map((s: string) => s.trim()).filter(Boolean)" type="text" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="Option 1, Option 2, Option 3" />
                      </div>
                      <!-- File accept -->
                      <div v-if="field.type === 'file'" class="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Accepted Files</label>
                          <input v-model="field.accept" type="text" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder=".pdf,.doc,.jpg" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-medium text-gray-500 mb-1">Max Size (MB)</label>
                          <input v-model.number="field.maxFileSize" type="number" min="1" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="10" />
                        </div>
                      </div>
                      <div class="mt-3 flex items-center gap-4">
                        <label class="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" v-model="field.required" class="rounded border-gray-300 text-brand focus:ring-brand" />
                          <span class="text-xs font-medium text-gray-600">Required</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
      </Transition>
    </Teleport>

    <!-- Submissions have been moved to a standalone page -->

    <!-- Delete Confirmation -->
    <UiModal :isOpen="isDeleteOpen" title="Delete Form" @close="isDeleteOpen = false">
      <div class="space-y-4 px-2 pb-4">
        <p class="text-sm text-gray-600">Are you sure you want to delete <strong>{{ activeForm?.title }}</strong>? All submissions will also be deleted.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isDeleteOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button @click="deleteFormAction" :disabled="deleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import axios from 'axios';
import UiModal from '@/components/ui/Modal.vue';
import UiSelect from '@/components/ui/Select.vue';
import { formsApi } from '@/api_factory/modules/forms';
import { storageApi } from '@/api_factory/modules/storage';
import { useCustomToast } from '@/composables/core/useCustomToast';
import * as XLSX from 'xlsx';

useSeoMeta({ title: 'Forms Management | Admin Dashboard' });

const { showToast } = useCustomToast();
const forms = ref<any[]>([]);
const loading = ref(true);
const subCounts = ref<Record<string, number>>({});
const viewMode = ref<'list' | 'grid'>('list');

// Builder
const isBuilderOpen = ref(false);
const isEditMode = ref(false);
const savingForm = ref(false);
const editFormId = ref('');

const formData = ref<any>({
  title: '', description: '', type: 'custom', status: 'draft', deadline: '',
  maxSubmissions: 0, successMessage: 'Thank you for your submission!',
  allowMultipleSubmissions: true, coverImage: '', fields: [],
});

// Cover image upload
const uploadingCover = ref(false);
const coverProgress = ref(0);

// Submissions moved to standalone page
const activeForm = ref<any>(null);

// Delete
const isDeleteOpen = ref(false);
const deleting = ref(false);

const formTypeOptions = [
  { label: 'Call for Papers', value: 'call-for-papers' },
  { label: 'Article Submission', value: 'article-submission' },
  { label: 'Comic Strip Contest', value: 'comic-strip-contest' },
  { label: 'Abstract Submission', value: 'abstract-submission' },
  { label: 'Registration', value: 'registration' },
  { label: 'Survey', value: 'survey' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Custom', value: 'custom' },
];

const fieldTypeOptions = [
  { label: 'Short Text', value: 'text' },
  { label: 'Long Text', value: 'textarea' },
  { label: 'Rich Text Editor', value: 'rich-text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'URL / Link', value: 'url' },
  { label: 'Dropdown', value: 'select' },
  { label: 'Radio Buttons', value: 'radio' },
  { label: 'Checkboxes', value: 'checkbox' },
  { label: 'File Upload', value: 'file' },
];

const templates = [
  {
    type: 'call-for-papers', label: '📄 Call for Papers', desc: 'Academic paper submission',
    fields: [
      { label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe', options: [], helpText: '', order: 0 },
      { label: 'Email Address', type: 'email', required: true, placeholder: 'john@uni.edu', options: [], helpText: '', order: 1 },
      { label: 'Institution / University', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 2 },
      { label: 'Paper Title', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 3 },
      { label: 'Abstract', type: 'textarea', required: true, placeholder: 'Max 300 words', options: [], helpText: 'Summarize your research in 300 words', order: 4 },
      { label: 'Keywords', type: 'text', required: false, placeholder: 'e.g. hematology, flow cytometry', options: [], helpText: 'Comma-separated', order: 5 },
      { label: 'Category', type: 'select', required: true, placeholder: '', options: ['Hematology', 'Microbiology', 'Chemical Pathology', 'Histopathology', 'Immunology', 'Other'], helpText: '', order: 6 },
      { label: 'Upload Manuscript (PDF)', type: 'file', required: true, placeholder: '', options: [], helpText: 'PDF only, max 10MB', accept: '.pdf', maxFileSize: 10, order: 7 },
    ]
  },
  {
    type: 'article-submission', label: '📝 Article Submission', desc: 'Blog/article content',
    fields: [
      { label: 'Author Name', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 0 },
      { label: 'Email', type: 'email', required: true, placeholder: '', options: [], helpText: '', order: 1 },
      { label: 'Article Title', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 2 },
      { label: 'Category', type: 'select', required: true, placeholder: '', options: ['Hematology', 'Microbiology', 'Chemical Pathology', 'General'], helpText: '', order: 3 },
      { label: 'Article Content', type: 'rich-text', required: true, placeholder: 'Write your article here...', options: [], helpText: '', order: 4 },
      { label: 'Cover Image', type: 'file', required: false, placeholder: '', options: [], helpText: 'JPG/PNG, max 5MB', accept: '.jpg,.jpeg,.png', maxFileSize: 5, order: 5 },
    ]
  },
  {
    type: 'comic-strip-contest', label: '🎨 Comic Strip Contest', desc: 'Creative comic submissions',
    fields: [
      { label: 'Artist Name', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 0 },
      { label: 'Email', type: 'email', required: true, placeholder: '', options: [], helpText: '', order: 1 },
      { label: 'University', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 2 },
      { label: 'Comic Title', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 3 },
      { label: 'Theme', type: 'select', required: true, placeholder: '', options: ['Lab Safety', 'Microscopy Adventures', 'Blood Cell Heroes', 'Pathology Mysteries', 'Free Theme'], helpText: '', order: 4 },
      { label: 'Comic Strip (Image)', type: 'file', required: true, placeholder: '', options: [], helpText: 'JPG/PNG, max 20MB', accept: '.jpg,.jpeg,.png,.gif', maxFileSize: 20, order: 5 },
      { label: "Artist's Statement", type: 'textarea', required: false, placeholder: 'Tell us about your comic...', options: [], helpText: 'Max 200 words', order: 6 },
    ]
  },
  {
    type: 'abstract-submission', label: '🔬 Abstract Submission', desc: 'Conference abstract',
    fields: [
      { label: 'Presenter Name', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 0 },
      { label: 'Email', type: 'email', required: true, placeholder: '', options: [], helpText: '', order: 1 },
      { label: 'Co-Authors', type: 'text', required: false, placeholder: 'Separate with commas', options: [], helpText: '', order: 2 },
      { label: 'Affiliation', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 3 },
      { label: 'Abstract Title', type: 'text', required: true, placeholder: '', options: [], helpText: '', order: 4 },
      { label: 'Presentation Type', type: 'radio', required: true, placeholder: '', options: ['Oral Presentation', 'Poster Presentation', 'Workshop'], helpText: '', order: 5 },
      { label: 'Abstract Body', type: 'textarea', required: true, placeholder: '', options: [], helpText: 'Max 500 words. Include: Background, Methods, Results, Conclusion.', order: 6 },
    ]
  },
];

const formTypeColor = (type: string) => {
  const map: Record<string, string> = {
    'call-for-papers': 'bg-purple-500', 'article-submission': 'bg-blue-500', 'comic-strip-contest': 'bg-pink-500',
    'abstract-submission': 'bg-teal-500', 'registration': 'bg-green-500', 'survey': 'bg-yellow-500',
    'feedback': 'bg-orange-500', 'custom': 'bg-gray-500',
  };
  return map[type] || 'bg-brand';
};

const formTypeLabel = (type: string) => type.replace(/-/g, ' ');

const formStatusClass = (s: string) => {
  if (s === 'active') return 'bg-green-100 text-green-700';
  if (s === 'closed') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-600';
};

const fetchForms = async () => {
  try {
    loading.value = true;
    const res = await formsApi.getForms();
    forms.value = res.data || res;
    const countsRes = await formsApi.getSubmissionCounts();
    const countsData = countsRes.data || countsRes;
    subCounts.value = {};
    countsData.forEach((c: any) => { subCounts.value[c._id] = c.count; });
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

const openFormBuilder = () => {
  isEditMode.value = false;
  editFormId.value = '';
  formData.value = {
    title: '', description: '', type: 'custom', status: 'draft', deadline: '',
    maxSubmissions: 0, successMessage: 'Thank you for your submission!',
    allowMultipleSubmissions: true, coverImage: '', coverImagePreview: '', coverImageFile: null, fields: [],
  };
  isBuilderOpen.value = true;
};

const editForm = (form: any) => {
  isEditMode.value = true;
  editFormId.value = form._id;
  formData.value = {
    title: form.title, description: form.description || '', type: form.type, status: form.status,
    deadline: form.deadline ? new Date(form.deadline).toISOString().slice(0, 16) : '',
    maxSubmissions: form.maxSubmissions || 0, successMessage: form.successMessage || '',
    allowMultipleSubmissions: form.allowMultipleSubmissions !== false,
    coverImage: form.coverImage || '',
    fields: (form.fields || []).map((f: any) => ({ ...f })),
  };
  isBuilderOpen.value = true;
};

const addField = () => {
  formData.value.fields.push({ label: '', type: 'text', required: false, placeholder: '', helpText: '', options: [], order: formData.value.fields.length });
};

const removeField = (idx: number) => { formData.value.fields.splice(idx, 1); };
const moveField = (idx: number, dir: number) => {
  const fields = formData.value.fields;
  const target = idx + dir;
  [fields[idx], fields[target]] = [fields[target], fields[idx]];
};

const applyTemplate = (t: any) => {
  formData.value.type = t.type;
  formData.value.fields = t.fields.map((f: any) => ({ ...f }));
  showToast({ title: 'Template Applied', message: `${t.label} fields loaded.`, type: 'success' });
};

const saveForm = async () => {
  if (!formData.value.title) { showToast({ title: 'Error', message: 'Form title is required', type: 'error' }); return; }
  savingForm.value = true;
  try {
    if (formData.value.coverImageFile) {
      await performCoverUpload(formData.value.coverImageFile);
    }
    const payload = JSON.parse(JSON.stringify(formData.value));
    delete payload.coverImagePreview;
    delete payload.coverImageFile;

    if (isEditMode.value) {
      await formsApi.updateForm(editFormId.value, payload);
      showToast({ title: 'Updated', message: 'Form updated successfully', type: 'success' });
    } else {
      await formsApi.createForm(payload);
      showToast({ title: 'Created', message: 'Form created successfully', type: 'success' });
    }
    isBuilderOpen.value = false;
    fetchForms();
  } catch (e) { showToast({ title: 'Error', message: 'Failed to save form', type: 'error' }); }
  finally { savingForm.value = false; }
};

const copyFormLink = async (form: any) => {
  const slug = form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'form';
  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3003' : 'https://universe.medlabconvo.com';
  const url = `${baseUrl}/forms/${slug}-${form._id}`;
  try {
    await navigator.clipboard.writeText(url);
    showToast({ title: 'Link Copied!', message: 'Form link copied to clipboard.', type: 'success' });
  } catch (e) { showToast({ title: 'Failed', message: 'Could not copy link.', type: 'error' }); }
};

const viewSubmissions = (form: any) => {
  const router = useRouter();
  router.push(`/forms/${form._id}/submissions`);
};

// Moved to standalone page

const confirmDeleteForm = (form: any) => { activeForm.value = form; isDeleteOpen.value = true; };
const deleteFormAction = async () => {
  deleting.value = true;
  try {
    await formsApi.deleteForm(activeForm.value._id);
    showToast({ title: 'Deleted', message: 'Form deleted.', type: 'success' });
    isDeleteOpen.value = false;
    fetchForms();
  } catch (e) { showToast({ title: 'Error', message: 'Failed to delete form.', type: 'error' }); }
  finally { deleting.value = false; }
};

onMounted(() => fetchForms());

// Cloudinary cover image upload handler
const handleCoverUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast({ title: 'Error', message: 'Please select an image file', type: 'error' });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast({ title: 'Error', message: 'Image must be less than 5MB', type: 'error' });
    return;
  }
  formData.value.coverImageFile = file;
  formData.value.coverImagePreview = URL.createObjectURL(file);
};

const performCoverUpload = async (file: File) => {
  uploadingCover.value = true;
  coverProgress.value = 0;

  try {
    const { data: sigData } = await storageApi.getUploadSignature({ folder: 'interntional/forms' });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sigData.apiKey);
    fd.append('timestamp', sigData.timestamp.toString());
    fd.append('signature', sigData.signature);
    fd.append('folder', sigData.folder);
    if (sigData.eager) fd.append('eager', sigData.eager);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
    const { data: uploadResult } = await axios.post(cloudinaryUrl, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (ev) => {
        if (ev.total) coverProgress.value = Math.round((ev.loaded / ev.total) * 100);
      },
    });

    formData.value.coverImage = uploadResult.secure_url;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to upload image');
  } finally {
    uploadingCover.value = false;
  }
};

const isHtmlContent = (val: string): boolean => {
  if (!val || typeof val !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(val);
};
</script>

<style scoped>
/* Rendered HTML content in responses */
.response-html-content :deep(h1) {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.4em 0 0.2em;
  color: #111827;
}
.response-html-content :deep(h2) {
  font-size: 1.25em;
  font-weight: 700;
  margin: 0.3em 0 0.15em;
  color: #1f2937;
}
.response-html-content :deep(h3) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.25em 0 0.1em;
  color: #374151;
}
.response-html-content :deep(p) {
  margin: 0.25em 0;
  line-height: 1.6;
}
.response-html-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.3em 0;
}
.response-html-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.3em 0;
}
.response-html-content :deep(li) {
  margin: 0.1em 0;
}
.response-html-content :deep(blockquote) {
  border-left: 3px solid #60a5fa;
  padding: 0.4em 0.8em;
  margin: 0.4em 0;
  background: #eff6ff;
  border-radius: 0 6px 6px 0;
  color: #1e40af;
  font-style: italic;
}
.response-html-content :deep(pre) {
  background: #1f2937;
  color: #f9fafb;
  padding: 0.8em;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85em;
  overflow-x: auto;
  margin: 0.4em 0;
}
.response-html-content :deep(code) {
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
  color: #e11d48;
}
.response-html-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
.response-html-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 6px 0;
}
.response-html-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 6px 0;
}
.response-html-content :deep(th),
.response-html-content :deep(td) {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  text-align: left;
  font-size: 0.85em;
}
.response-html-content :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}
.response-html-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.6em 0;
}
</style>
