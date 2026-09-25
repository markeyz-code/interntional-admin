<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Forms Management</h1>
        <p class="text-sm text-gray-500 mt-1">Build custom forms for events, call for papers, article submissions, surveys and more.</p>
      </div>
      <button @click="openFormBuilder" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Create Form
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Forms Grid -->
    <div v-else-if="forms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="form in forms" :key="form._id" class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group">
        <div class="h-2" :class="formTypeColor(form.type)"></div>
        <div class="p-5">
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
        <div class="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
          <button @click="copyFormLink(form)" class="text-xs font-medium text-green-600 hover:text-green-800 transition-colors">🔗 Copy Link</button>
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
          <!-- Top Bar -->
          <div class="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <button @click="isBuilderOpen = false" class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Forms
              </button>
              <div class="flex items-center gap-3">
                <button @click="saveForm" :disabled="savingForm" class="px-5 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#1f4e70] transition-colors shadow-sm disabled:opacity-50">
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
                          <select v-model="field.type" class="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand bg-white">
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="rich-text">Rich Text Editor</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="url">URL / Link</option>
                            <option value="select">Dropdown</option>
                            <option value="radio">Radio Buttons</option>
                            <option value="checkbox">Checkboxes</option>
                            <option value="file">File Upload</option>
                          </select>
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
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== SUBMISSIONS MODAL ===================== -->
    <UiModal :isOpen="isSubsModalOpen" :title="`Responses — ${activeForm?.title || ''}`" @close="isSubsModalOpen = false">
      <div class="space-y-4 px-2 pb-4">
        <div v-if="subsLoading" class="flex justify-center py-8">
          <div class="w-6 h-6 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="submissions.length === 0" class="text-center py-8 text-gray-500 text-sm">No submissions yet.</div>
        <div v-else>
          <div class="mb-4 text-sm font-bold text-gray-900">{{ submissions.length }} Responses</div>
          <div class="max-h-[50vh] overflow-y-auto space-y-3">
            <div v-for="sub in submissions" :key="sub._id" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="font-medium text-gray-900 text-sm">{{ sub.submitterName || 'Anonymous' }}</span>
                  <span class="text-xs text-gray-400 ml-2">{{ sub.submitterEmail }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <select v-model="sub.status" @change="updateSubStatus(sub)" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-gray-200 bg-white">
                    <option value="submitted">Submitted</option>
                    <option value="under-review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button @click="deleteSub(sub._id)" class="text-red-500 hover:bg-red-100 p-1 rounded text-xs">✕</button>
                </div>
              </div>
              <div class="space-y-1.5">
                <div v-for="(val, key) in sub.data" :key="key" class="text-xs">
                  <span class="font-medium text-gray-600">{{ key }}:</span>
                  <span class="text-gray-800 ml-1">{{ val }}</span>
                </div>
              </div>
              <div class="text-[10px] text-gray-400 mt-2">{{ new Date(sub.createdAt).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="isSubsModalOpen = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors">Close</button>
      </template>
    </UiModal>

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
import UiModal from '@/components/ui/Modal.vue';
import UiSelect from '@/components/ui/Select.vue';
import { formsApi } from '@/api_factory/modules/forms';
import { useCustomToast } from '@/composables/core/useCustomToast';

useSeoMeta({ title: 'Forms Management | Admin Dashboard' });

const { showToast } = useCustomToast();
const forms = ref<any[]>([]);
const loading = ref(true);
const subCounts = ref<Record<string, number>>({});

// Builder
const isBuilderOpen = ref(false);
const isEditMode = ref(false);
const savingForm = ref(false);
const editFormId = ref('');

const formData = ref<any>({
  title: '', description: '', type: 'custom', status: 'draft', deadline: '',
  maxSubmissions: 0, successMessage: 'Thank you for your submission!',
  allowMultipleSubmissions: true, fields: [],
});

// Submissions
const isSubsModalOpen = ref(false);
const subsLoading = ref(false);
const activeForm = ref<any>(null);
const submissions = ref<any[]>([]);

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
    allowMultipleSubmissions: true, fields: [],
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
    if (isEditMode.value) {
      await formsApi.updateForm(editFormId.value, formData.value);
      showToast({ title: 'Updated', message: 'Form updated successfully', type: 'success' });
    } else {
      await formsApi.createForm(formData.value);
      showToast({ title: 'Created', message: 'Form created successfully', type: 'success' });
    }
    isBuilderOpen.value = false;
    fetchForms();
  } catch (e) { showToast({ title: 'Error', message: 'Failed to save form', type: 'error' }); }
  finally { savingForm.value = false; }
};

const copyFormLink = async (form: any) => {
  const slug = form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'form';
  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://universe.medlabconvo.com';
  const url = `${baseUrl}/forms/${slug}-${form._id}`;
  try {
    await navigator.clipboard.writeText(url);
    showToast({ title: 'Link Copied!', message: 'Form link copied to clipboard.', type: 'success' });
  } catch (e) { showToast({ title: 'Failed', message: 'Could not copy link.', type: 'error' }); }
};

const viewSubmissions = async (form: any) => {
  activeForm.value = form;
  isSubsModalOpen.value = true;
  subsLoading.value = true;
  try {
    const res = await formsApi.getSubmissions(form._id);
    submissions.value = res.data || res;
  } catch (e) { console.error(e); } finally { subsLoading.value = false; }
};

const updateSubStatus = async (sub: any) => {
  try { await formsApi.updateSubmission(sub._id, { status: sub.status }); } catch (e) { console.error(e); }
};

const deleteSub = async (id: string) => {
  try {
    await formsApi.deleteSubmission(id);
    submissions.value = submissions.value.filter(s => s._id !== id);
    showToast({ title: 'Removed', message: 'Submission deleted.', type: 'success' });
  } catch (e) { showToast({ title: 'Error', message: 'Failed to delete.', type: 'error' }); }
};

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
</script>
