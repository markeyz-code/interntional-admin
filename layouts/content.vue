<template>
  <div class="fixed inset-0 bg-gray-50 flex flex-col md:flex-row font-sans overflow-hidden">
    <!-- Mobile Header -->
    <header class="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center" :class="businessInfo.theme">
          <component :is="businessInfo.icon === 'GraduationCap' ? GraduationCap : FlaskConical" class="w-4 h-4 text-white" />
        </div>
        <h2 class="text-sm font-bold text-gray-900">{{ businessInfo.name }}</h2>
      </div>
      <button @click="isMobileSidebarOpen = !isMobileSidebarOpen" class="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
        <MenuIcon v-if="!isMobileSidebarOpen" class="w-6 h-6" />
        <XIcon v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- Overlay for mobile sidebar -->
    <div v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

    <aside 
      :class="[
        'w-64 h-screen bg-gray-900 flex-shrink-0 flex flex-col z-50 overflow-y-auto transition-transform duration-300 absolute md:relative',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Business Switcher -->
      <div class="relative border-b border-gray-800">
        <button 
          @click="isBusinessDropdownOpen = !isBusinessDropdownOpen"
          class="w-full h-16 flex items-center justify-between px-4 hover:bg-gray-800 transition-colors focus:outline-none"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0" :class="businessInfo.theme">
              <component :is="businessInfo.icon === 'GraduationCap' ? GraduationCap : FlaskConical" class="w-4 h-4 text-white" />
            </div>
            <div class="text-left overflow-hidden">
              <h2 class="text-sm font-bold text-white truncate">{{ businessInfo.name }}</h2>
              <p class="text-[10px] text-gray-400 truncate uppercase tracking-wider">{{ businessInfo.tagline }}</p>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform" :class="{'rotate-180': isBusinessDropdownOpen}" />
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isBusinessDropdownOpen" 
          class="absolute top-16 left-2 right-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <div class="p-1">
            <button 
              @click="selectBusiness('internTional')"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <div class="w-6 h-6 rounded bg-brand flex items-center justify-center flex-shrink-0">
                <FlaskConical class="w-3 h-3 text-white" />
              </div>
              <span class="font-medium text-left">InternTional</span>
              <Check v-if="activeBusiness === 'internTional'" class="w-4 h-4 text-brand ml-auto" />
            </button>
            <button 
              @click="selectBusiness('uniVerse')"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <div class="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap class="w-3 h-3 text-white" />
              </div>
              <span class="font-medium text-left">UniVerse</span>
              <Check v-if="activeBusiness === 'uniVerse'" class="w-4 h-4 text-indigo-400 ml-auto" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="px-4 py-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Management</p>
        <nav class="space-y-1">
          <NuxtLink 
            v-for="item in sidebarMenu" 
            :key="item.name"
            :to="item.path" 
            class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" 
            active-class="bg-gray-800 text-white" 
            :class="{'bg-gray-800 text-white': $route.path === item.path}"
          >
            <component :is="getIcon(item.icon)" class="w-5 h-5" />
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>

      <div class="mt-auto p-4 border-t border-gray-800">
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <LogOut class="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 h-[calc(100vh-4rem)] md:h-screen overflow-hidden relative">
      <!-- Full screen loader -->
      <div v-if="isLoadingConfig" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4"></div>
        <h3 class="text-lg font-bold text-gray-900">Switching Configuration...</h3>
        <p class="text-sm text-gray-500">Loading {{ businessInfo.name }} ecosystem data</p>
      </div>

      <header class="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-end px-6 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-gray-700">Super Admin</span>
          <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-700 text-xs font-bold">
            SA
          </div>
        </div>
      </header>
      
      <main class="flex-1 overflow-hidden flex flex-col">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Users, Folder, Briefcase, LogOut, MessageSquare, CreditCard, Wallet, LayoutDashboard, BarChart2, Shield, Layers, ChevronDown, Check, GraduationCap, FlaskConical, Building2, Calendar, Menu as MenuIcon, X as XIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/core/useAuth';
import { useBusinessContext, type BusinessType } from '@/composables/core/useBusinessContext';

const router = useRouter();
const { clearAuth } = useAuth();
const { activeBusiness, businessInfo, sidebarMenu, setBusiness } = useBusinessContext();

const icons: Record<string, any> = {
  LayoutDashboard,
  BarChart2,
  Users,
  Shield,
  Folder,
  Briefcase,
  Layers,
  MessageSquare,
  CreditCard,
  Wallet,
  Building2,
  Calendar,
  GraduationCap
};

const getIcon = (iconName: string) => icons[iconName] || LayoutDashboard;

const isBusinessDropdownOpen = ref(false);
const isMobileSidebarOpen = ref(false);
const isLoadingConfig = ref(false);

const selectBusiness = async (business: BusinessType) => {
  isBusinessDropdownOpen.value = false;
  isMobileSidebarOpen.value = false;
  
  // Show full screen loader
  isLoadingConfig.value = true;
  
  // Fake API call to simulate fetching new configuration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setBusiness(business);
  isLoadingConfig.value = false;
};

// Simple click-outside directive equivalent for Vue composition API inside setup (or just ignore click outside for now for simplicity, wait I added v-click-outside, I should probably just implement a simple body click listener).
import { onMounted, onUnmounted, watch } from 'vue';
const closeDropdown = (e: Event) => {
  if (!(e.target as Element).closest('.relative')) {
    isBusinessDropdownOpen.value = false;
  }
};
onMounted(() => document.addEventListener('click', closeDropdown));
onUnmounted(() => document.removeEventListener('click', closeDropdown));

const route = useRoute();
watch(() => route.path, () => {
  isMobileSidebarOpen.value = false;
});

const handleLogout = () => {
  clearAuth();
  router.push('/login');
};
</script>
