<template>
  <div class="h-full flex overflow-hidden bg-white font-sans flex-1 w-full">
    
    <!-- Left Sidebar: Folders / Categories -->
    <div class="w-72 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300">
      <div class="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80 backdrop-blur">
        <h2 class="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-brand" /> Content
        </h2>
        <button class="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500" title="CMS Settings">
          <Settings class="w-4 h-4" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <p class="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Workspace</p>
          <nav class="space-y-1">
            <button class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg bg-brand text-white shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5">
              <span class="flex items-center gap-2.5"><FileText class="w-4 h-4" /> All Posts</span>
              <span class="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">24</span>
            </button>
            <button class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
              <span class="flex items-center gap-2.5"><FileEdit class="w-4 h-4" /> Drafts</span>
              <span class="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">3</span>
            </button>
            <button class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
              <span class="flex items-center gap-2.5"><Calendar class="w-4 h-4" /> Scheduled</span>
            </button>
            <button class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
              <span class="flex items-center gap-2.5"><Image class="w-4 h-4" /> Media Library</span>
            </button>
          </nav>
        </div>

        <div>
          <p class="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Topics</p>
          <nav class="space-y-1.5">
            <button class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm shadow-red-400/50 group-hover:scale-125 transition-transform"></span> Hematology
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50 group-hover:scale-125 transition-transform"></span> Microbiology
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group">
              <span class="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50 group-hover:scale-125 transition-transform"></span> Chemical Pathology
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group">
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50 group-hover:scale-125 transition-transform"></span> General News
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Middle: Post List -->
    <div class="w-96 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
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
            type="text" 
            placeholder="Search articles..." 
            class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all outline-none"
          />
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
        <button 
          v-for="post in posts" 
          :key="post.id"
          @click="selectPost(post)"
          class="w-full text-left p-5 hover:bg-gray-50 transition-all border-l-4"
          :class="activePost?.id === post.id ? 'border-brand bg-brand/5 hover:bg-brand/5' : 'border-transparent'"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                  :class="post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'">
              {{ post.status }}
            </span>
            <span class="text-[11px] text-gray-400 font-medium">{{ post.date }}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-sm line-clamp-2 mb-1.5 leading-snug" 
              :class="{'text-brand': activePost?.id === post.id}">
            {{ post.title || 'Untitled Draft' }}
          </h3>
          <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ post.excerpt || 'No description yet.' }}</p>
        </button>
      </div>
    </div>

    <!-- Right: Editor Area -->
    <div class="flex-1 bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      <div v-if="activePost" class="flex-1 flex flex-col h-full">
        
        <!-- Editor Toolbar -->
        <div class="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur z-20">
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand">
              <Edit3 class="w-4 h-4" />
            </span>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Editor</p>
              <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ activePost.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 font-medium mr-2">Last saved just now</span>
            <button class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <Eye class="w-4 h-4" />
            </button>
            <button class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all shadow-sm">
              Save Draft
            </button>
            <button class="px-5 py-2 text-sm font-medium text-white bg-brand hover:bg-[#1f4e70] rounded-lg transition-all shadow-sm shadow-brand/20 flex items-center gap-2">
              <Send class="w-4 h-4" /> Publish
            </button>
          </div>
        </div>
        
        <!-- Editor Canvas -->
        <div class="flex-1 overflow-y-auto px-8 py-12 lg:px-16 scroll-smooth">
          <div class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-10 min-h-full">
            
            <!-- Cover Image Placeholder -->
            <div class="w-full h-48 bg-gray-100 rounded-xl mb-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer group">
              <Image class="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-2 transition-colors" />
              <span class="text-sm font-medium text-gray-500 group-hover:text-gray-700">Add Cover Image</span>
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
                :options="[{label: 'Hematology', value: 'Hematology'}, {label: 'Microbiology', value: 'Microbiology'}, {label: 'Chemical Pathology', value: 'Chemical Pathology'}, {label: 'General News', value: 'General'}]"
                class="w-48"
              />
              <div class="w-px h-4 bg-gray-200 mx-2"></div>
              <div class="flex items-center gap-2 text-sm text-gray-500 font-medium cursor-pointer hover:text-brand transition-colors">
                <Tag class="w-4 h-4" /> Add Tags
              </div>
            </div>

            <!-- WYSIWYG Toolbar Mockup -->
            <div class="flex items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all font-serif font-bold">B</button>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all font-serif italic">I</button>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all font-serif underline">U</button>
              <div class="w-px h-4 bg-gray-300 mx-1"></div>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all"><LinkIcon class="w-4 h-4" /></button>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all"><List class="w-4 h-4" /></button>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all"><Quote class="w-4 h-4" /></button>
              <div class="w-px h-4 bg-gray-300 mx-1"></div>
              <button class="p-1.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded transition-all flex items-center gap-1 text-xs font-medium"><Code class="w-4 h-4" /> Code</button>
            </div>

            <textarea 
              v-model="activePost.content"
              placeholder="Start writing your amazing content here..."
              class="w-full min-h-[500px] text-lg text-gray-700 placeholder-gray-300 border-none outline-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed font-serif"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- No post selected state -->
      <div v-else class="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div class="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-3xl flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-all duration-300">
          <BookOpen class="w-10 h-10 text-brand/50" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your Content Canvas</h3>
        <p class="text-gray-500 mb-8 max-w-sm text-center leading-relaxed">Select an article from the left sidebar to start editing, or create a new masterpiece.</p>
        <button 
          @click="createNewPost"
          class="px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand/20 hover:bg-[#1f4e70] hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus class="w-5 h-5" /> Start Writing
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import { Settings, FileText, FileEdit, Calendar, Plus, Search, Edit3, Image, BookOpen, Send, Eye, Folder, Tag, Link as LinkIcon, List, Quote, Code } from 'lucide-vue-next';
import UiSelect from '@/components/ui/Select.vue';

definePageMeta({ layout: 'content' });
useSeoMeta({ title: 'CMS | Admin Dashboard' });

// Dummy CMS Data
const posts = ref([
  {
    id: 1,
    title: 'Understanding Clinical Hematology Basics',
    excerpt: 'Clinical Hematology is the study of blood cells and coagulation. This guide covers the morphology of red blood cells...',
    content: 'Clinical Hematology is the study of blood cells and coagulation. This section covers the morphology of red blood cells, white blood cells, and platelets. Interns should focus on identifying common abnormalities such as microcytic anemia and leukocytosis in peripheral blood smears.\n\nLaboratory Safety & SOPs\nAll laboratory personnel must adhere to universal precautions. This includes the mandatory use of Personal Protective Equipment (PPE) such as lab coats, gloves, and face shields. Proper disposal of bio-hazardous waste in designated sharps container and autoclave bags is essential for infection control.',
    category: 'Hematology',
    status: 'published',
    date: 'Oct 12'
  },
  {
    id: 2,
    title: 'Microbiology Staining Techniques Standard',
    excerpt: 'Gram staining remains the gold standard for preliminary bacterial identification. Review the four-step process.',
    content: 'Gram staining remains the gold standard for preliminary bacterial identification. This resource details the four-step process: Primary Stain (Crystal Violet), Mordant (Iodine), Decolorizer (Alcohol), and Counterstain (Safranin). Accuracy in heat-fixing is vital for maintaining cell wall integrity.',
    category: 'Microbiology',
    status: 'published',
    date: 'Oct 10'
  },
  {
    id: 3,
    title: 'Upcoming Webinar: Chemical Pathology Ranges',
    excerpt: 'Join us next week as we discuss reference ranges and their critical role in interpretation of patient results.',
    content: '',
    category: 'General',
    status: 'draft',
    date: 'Oct 08'
  }
]);

const activePost = ref<any>(null);

const selectPost = (post: any) => {
  activePost.value = { ...post };
};

const createNewPost = () => {
  const newPost = {
    id: Date.now(),
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    status: 'draft',
    date: 'Just now'
  };
  posts.value.unshift(newPost);
  activePost.value = newPost;
};
</script>
