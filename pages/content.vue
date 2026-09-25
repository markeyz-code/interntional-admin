<template>
  <div class="h-screen flex overflow-hidden bg-white font-sans flex-1 w-full">
    
    <!-- Left Sidebar: Folders / Categories -->
    <div class="w-72 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300">
      <div class="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80 backdrop-blur">
        <h2 class="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-brand" /> Content
        </h2>
        <NuxtLink to="/overview" class="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500" title="Back to Dashboard">
          <ArrowLeft class="w-4 h-4" />
        </NuxtLink>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <p class="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Workspace</p>
          <nav class="space-y-1">
            <button @click="activeTab = 'all'" :class="activeTab === 'all' ? 'bg-brand text-white shadow-sm shadow-brand/20 hover:-translate-y-0.5' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200'" class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all">
              <span class="flex items-center gap-2.5"><FileText class="w-4 h-4" /> All Posts</span>
              <span :class="activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">{{ posts.length }}</span>
            </button>
            <button @click="activeTab = 'draft'" :class="activeTab === 'draft' ? 'bg-brand text-white shadow-sm shadow-brand/20 hover:-translate-y-0.5' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200'" class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all">
              <span class="flex items-center gap-2.5"><FileEdit class="w-4 h-4" /> Drafts</span>
              <span :class="activeTab === 'draft' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">{{ posts.filter(p => p.status === 'draft').length }}</span>
            </button>
            <button @click="activeTab = 'scheduled'" :class="activeTab === 'scheduled' ? 'bg-brand text-white shadow-sm shadow-brand/20 hover:-translate-y-0.5' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200'" class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all">
              <span class="flex items-center gap-2.5"><Calendar class="w-4 h-4" /> Scheduled</span>
              <span :class="activeTab === 'scheduled' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">{{ posts.filter(p => p.status === 'scheduled').length }}</span>
            </button>
            <button @click="activeTab = 'media'" :class="activeTab === 'media' ? 'bg-brand text-white shadow-sm shadow-brand/20 hover:-translate-y-0.5' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200'" class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all">
              <span class="flex items-center gap-2.5"><Image class="w-4 h-4" /> Media Library</span>
            </button>
          </nav>
        </div>

        <div>
          <div class="flex items-center justify-between px-2 mb-3">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Topics</p>
            <button @click="showCategoryModal = true" class="text-xs text-brand hover:underline font-medium">Manage</button>
          </div>
          <nav class="space-y-1.5">
            <button v-for="cat in categories" :key="cat.id" @click="activeCategory = activeCategory === cat.name ? '' : cat.name" 
              :class="activeCategory === cat.name ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100'"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group">
              <span class="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform" :class="cat.color"></span> {{ cat.name }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Middle: Post List -->
    <div v-if="activeTab !== 'media'" class="w-96 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div class="p-5 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Articles</h2>
          <button 
            @click="createNewPost"
            class="p-2 bg-brand text-white rounded-lg hover:bg-[#1f4e70] transition-colors shadow-sm shadow-brand/20 flex items-center gap-1.5 text-xs font-medium"
          >
            <Plus class="w-3.5 h-3.5" /> New
          </button>
        </div>
        <div class="relative group">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand transition-colors" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search articles..." 
            class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all outline-none"
          />
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
        <button 
          v-for="post in posts" 
          :key="post._id"
          @click="selectPost(post)"
          class="w-full text-left p-5 hover:bg-gray-50 transition-all border-l-4"
          :class="activePost?._id === post._id ? 'border-brand bg-brand/5 hover:bg-brand/5' : 'border-transparent'"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                  :class="post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'">
              {{ post.status }}
            </span>
            <span class="text-[11px] text-gray-400 font-medium">{{ post.date }}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-sm line-clamp-2 mb-1.5 leading-snug" 
              :class="{'text-brand': activePost?._id === post._id}">
            {{ post.title || 'Untitled Draft' }}
          </h3>
          <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ post.excerpt || 'No description yet.' }}</p>
        </button>
      </div>
    </div>

    <!-- Right: Editor Area -->
    <div v-if="activeTab !== 'media'" class="flex-1 bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      <div v-if="activePost" class="flex-1 flex flex-col h-full">
        
        <!-- Editor Toolbar -->
        <div class="min-h-[4rem] py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 px-8 bg-white/80 backdrop-blur z-20">
          <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand">
              <Edit3 class="w-4 h-4" />
            </span>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Editor</p>
              <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ activePost.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <div v-if="activePost?.status === 'published'" class="flex items-center gap-2 mr-2 sm:mr-4 bg-gray-100 rounded-lg px-2 py-1 border border-gray-200">
              <span class="text-xs text-gray-500 font-medium truncate max-w-[100px] sm:max-w-[150px]">{{ getShareUrl(activePost) }}</span>
              <button @click="copyShareUrl" class="p-1 hover:bg-gray-200 rounded text-brand transition-colors" title="Copy Link">
                <LinkIcon class="w-3.5 h-3.5" />
              </button>
            </div>
            <span class="text-xs text-gray-400 font-medium mr-2">Last saved just now</span>
            <button @click="showPreviewModal = true" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <Eye class="w-4 h-4" />
            </button>
            <button @click="saveDraft" :disabled="isSavingDraft || isPublishing" class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2 v-if="isSavingDraft" class="w-4 h-4 animate-spin" />
              <span>{{ isSavingDraft ? 'Saving...' : 'Save Draft' }}</span>
            </button>
            <button @click="publishPost" :disabled="isSavingDraft || isPublishing" class="px-5 py-2 text-sm font-medium text-white bg-brand hover:bg-[#1f4e70] rounded-lg transition-all shadow-sm shadow-brand/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2 v-if="isPublishing" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" /> 
              <span>{{ isPublishing ? 'Publishing...' : 'Publish' }}</span>
            </button>
          </div>
        </div>
        
        <!-- Editor Canvas -->
        <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6 scroll-smooth">
          <div class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-full">
            
            <!-- Cover Image Upload/Preview -->
            <div class="relative w-full h-48 bg-gray-100 rounded-xl mb-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer group overflow-hidden" @click="$refs.coverImageInput.click()">
              <img v-if="activePost.coverImage" :src="activePost.coverImage" class="absolute inset-0 w-full h-full object-cover z-10" />
              <div v-if="activePost.coverImage" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                <span class="text-white font-medium flex items-center gap-2"><Edit3 class="w-4 h-4" /> Change Cover</span>
              </div>
              <div v-else class="flex flex-col items-center justify-center z-10">
                <Image class="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-2 transition-colors" />
                <span class="text-sm font-medium text-gray-500 group-hover:text-gray-700">Add Cover Image</span>
              </div>
              <input type="file" accept="image/*" class="hidden" ref="coverImageInput" @change="handleCoverImageUpload" />
            </div>

            <input 
              v-model="activePost.title"
              type="text" 
              placeholder="Post Title..." 
              class="w-full text-4xl font-black text-gray-900 placeholder-gray-300 border-none outline-none focus:ring-0 p-0 bg-transparent mb-6 tracking-tight"
            />
            
            <div class="flex items-center gap-4 py-4 mb-8 border-y border-gray-100">
              <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Folder class="w-4 h-4" /> Category:
              </div>
              <UiSelect 
                v-model="activePost.category"
                label=""
                :options="categories.map(c => ({ label: c.name, value: c.name }))"
                class="w-48"
              />
              <div class="w-px h-4 bg-gray-200 mx-2"></div>
              <div class="flex items-center gap-2 text-sm text-gray-500 font-medium cursor-pointer hover:text-brand transition-colors">
                <Tag class="w-4 h-4" /> Add Tags
              </div>
            </div>

            <ClientOnly>
              <UiTiptapEditor v-model="activePost.content" class="min-h-[500px]" />
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- No post selected state -->
      <div v-else class="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div class="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-3xl flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-all duration-300">
          <BookOpen class="w-10 h-10 text-brand/50" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2 tracking-tight">Your Content Canvas</h3>
        <p class="text-gray-500 mb-8 max-w-sm text-center leading-relaxed">Select an article from the left sidebar to start editing, or create a new masterpiece.</p>
        <button 
          @click="createNewPost"
          class="px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand/20 hover:bg-[#1f4e70] hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus class="w-5 h-5" /> Start Writing
        </button>
      </div>
    </div>
    
    <!-- Media Library Area -->
    <div v-if="activeTab === 'media'" class="flex-1 bg-[#FAFAFA] p-8 flex flex-col relative overflow-y-auto w-full">
      <div class="max-w-6xl mx-auto w-full">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Media Library</h1>
            <p class="text-sm text-gray-500 mt-1">Manage your platform's images and assets.</p>
          </div>
          <button class="px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand/90 transition-all font-medium text-sm shadow-sm flex items-center gap-2">
            <Image class="w-4 h-4" /> Upload Media
          </button>
        </div>

        <!-- Media Grid -->
        <div v-if="mediaItems.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="(img, idx) in mediaItems" :key="idx" class="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all aspect-square">
            <img :src="img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button class="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-sm" title="View">
                <Eye class="w-4 h-4" />
              </button>
              <button class="p-2 bg-white text-brand rounded-lg hover:bg-gray-100 transition-colors shadow-sm" title="Copy Link">
                <LinkIcon class="w-4 h-4" />
              </button>
              <button class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <div class="w-20 h-20 bg-brand/5 text-brand rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/10">
            <Image class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">No Media Found</h3>
          <p class="text-gray-500 text-sm max-w-md mx-auto">You haven't uploaded any images yet. Upload media to use them in your articles.</p>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <UiModal :isOpen="showPreviewModal" title="Preview Article" @close="showPreviewModal = false">
      <div class="space-y-6 max-h-[70vh] overflow-y-auto px-2 pb-4">
        <div v-if="activePost?.coverImage" class="w-full h-48 rounded-xl overflow-hidden shadow-sm">
          <img :src="activePost.coverImage" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-2">
          <span class="inline-block px-2 py-1 bg-brand/10 text-brand text-xs font-bold rounded uppercase tracking-wider">{{ activePost?.category }}</span>
          <h2 class="text-3xl font-black text-gray-900 leading-tight">{{ activePost?.title || 'Untitled Draft' }}</h2>
          <p class="text-sm text-gray-500">By Editor • Just now</p>
        </div>
        <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl text-gray-800" v-html="activePost?.content || '<p>No content available.</p>'"></div>
      </div>
      <template #footer>
        <button @click="showPreviewModal = false" class="px-5 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Close Preview</button>
      </template>
    </UiModal>

    <UiModal :isOpen="showCategoryModal" title="Manage Categories" @close="showCategoryModal = false">
      <div class="space-y-4">
        <!-- List Categories -->
        <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
          <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full shadow-sm" :class="cat.color"></span>
              <span class="text-sm font-medium text-gray-900">{{ cat.name }}</span>
            </div>
            <button @click="deleteCategory(cat.id)" class="text-red-500 hover:bg-red-100 p-1.5 rounded transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="w-full h-px bg-gray-200 my-4"></div>
        
        <!-- Add Category -->
        <div class="flex flex-col gap-3">
          <h4 class="text-sm font-semibold text-gray-900">Add New Topic</h4>
          <div class="flex gap-2">
            <UiInput v-model="newCategoryName" placeholder="Topic name..." class="flex-1" />
            <UiSelect v-model="newCategoryColor" :options="categoryColorOptions" class="w-32" />
            <button @click="addCategory" class="px-4 py-2 bg-brand text-white text-sm font-medium rounded hover:bg-brand/90 transition-colors">Add</button>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showCategoryModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors">Done</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSeoMeta } from '#imports';
import { Settings, FileText, FileEdit, Calendar, Plus, Search, Edit3, Image, BookOpen, Send, Eye, Folder, Tag, Link as LinkIcon, List, Quote, Code, ArrowLeft, Trash2, Loader2 } from 'lucide-vue-next';
import UiSelect from '@/components/ui/Select.vue';
import UiInput from '@/components/ui/Input.vue';
import UiModal from '@/components/ui/Modal.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { articlesApi } from '@/api_factory/modules/articles';

definePageMeta({ layout: false });
useSeoMeta({ title: 'CMS | Admin Dashboard' });

const { showToast } = useCustomToast();

const categories = ref([
  { id: 1, name: 'Hematology', color: 'bg-red-400' },
  { id: 2, name: 'Microbiology', color: 'bg-blue-400' },
  { id: 3, name: 'Chemical Pathology', color: 'bg-green-400' },
  { id: 4, name: 'General News', color: 'bg-yellow-400' },
]);

const showCategoryModal = ref(false);
const searchQuery = ref('');
const newCategoryName = ref('');
const newCategoryColor = ref('bg-brand');
const showPreviewModal = ref(false);

const isSavingDraft = ref(false);
const isPublishing = ref(false);

const saveDraft = async () => {
  if (!activePost.value) return;
  isSavingDraft.value = true;
  
  try {
    activePost.value.status = 'draft';
    if (activePost.value._id) {
      await articlesApi.updateArticle(activePost.value._id, activePost.value);
    } else {
      await articlesApi.createArticle(activePost.value);
    }
    
    showToast({
      title: 'Draft Saved',
      message: 'Your article has been saved as a draft successfully.',
      type: 'success'
    });
    await fetchArticles();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save draft', type: 'error' });
  } finally {
    isSavingDraft.value = false;
  }
};

const publishPost = async () => {
  if (!activePost.value) return;
  
  if (!activePost.value.title) {
    showToast({ title: 'Validation Error', message: 'Title is required to publish', type: 'error' });
    return;
  }

  isPublishing.value = true;
  
  try {
    activePost.value.status = 'published';
    if (activePost.value._id) {
      await articlesApi.updateArticle(activePost.value._id, activePost.value);
    } else {
      await articlesApi.createArticle(activePost.value);
    }
    
    showToast({
      title: 'Published Successfully',
      message: 'Your article is now live and published.',
      type: 'success'
    });
    await fetchArticles();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to publish post', type: 'error' });
  } finally {
    isPublishing.value = false;
  }
};
const categoryColorOptions = [
  { label: 'Red', value: 'bg-red-400' },
  { label: 'Blue', value: 'bg-blue-400' },
  { label: 'Green', value: 'bg-green-400' },
  { label: 'Yellow', value: 'bg-yellow-400' },
  { label: 'Purple', value: 'bg-purple-400' },
  { label: 'Pink', value: 'bg-pink-400' },
  { label: 'Orange', value: 'bg-orange-400' },
  { label: 'Teal', value: 'bg-teal-400' },
  { label: 'Brand', value: 'bg-brand' },
];

const addCategory = () => {
  if (newCategoryName.value.trim()) {
    categories.value.push({
      id: Date.now(),
      name: newCategoryName.value.trim(),
      color: newCategoryColor.value
    });
    newCategoryName.value = '';
    newCategoryColor.value = 'bg-brand';
  }
};

const activeTab = ref('all');
const activeCategory = ref('');

const getShareUrl = (post: any) => {
  if (!post || post.status !== 'published') return '';
  const slug = post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'article';
  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://universe.medlabconvo.com';
  return `${baseUrl}/articles/${slug}-${post._id}`;
};

const copyShareUrl = async () => {
  const url = getShareUrl(activePost.value);
  if (url) {
    try {
      await navigator.clipboard.writeText(url);
      showToast({ title: 'Link Copied!', message: 'Shareable URL copied to clipboard.', type: 'success' });
    } catch(e) {
      showToast({ title: 'Failed', message: 'Could not copy link.', type: 'error' });
    }
  }
};

const handleCoverImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file && activePost.value) {
    activePost.value.coverImage = URL.createObjectURL(file);
  }
};

const deleteCategory = (id: number) => {
  categories.value = categories.value.filter(c => c.id !== id);
};

// CMS Data
const posts = ref<any[]>([]);
const mediaItems = ref<string[]>([]);

const fetchArticles = async () => {
  try {
    const params: any = {};
    if (activeTab.value !== 'all' && activeTab.value !== 'media') {
      params.status = activeTab.value;
    }
    if (activeCategory.value) {
      params.category = activeCategory.value;
    }
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    const res = await articlesApi.getArticles(params);
    posts.value = res.data || res;
    
    // Extract cover images for media library
    if (posts.value.length) {
      mediaItems.value = [...new Set(posts.value.map(p => p.coverImage).filter(Boolean))];
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
};

import { onMounted, watch } from 'vue';
onMounted(() => {
  fetchArticles();
});

watch([activeTab, activeCategory, searchQuery], () => {
  fetchArticles();
});

const activePost = ref<any>(null);

const selectPost = (post: any) => {
  activePost.value = { ...post };
};

const createNewPost = () => {
  const newPost = {
    title: '',
    content: '',
    category: 'General News',
    status: 'draft',
    coverImage: null,
  };
  activePost.value = newPost;
};
</script>
