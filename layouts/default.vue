<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <aside class="w-64 bg-gray-900 flex-shrink-0 flex flex-col z-20">
      <div class="h-16 flex items-center px-6 border-b border-gray-800">
        <img src="~/assets/logo-icon.png" class="h-8 w-auto" alt="InternTional Logo" />
      </div>
      
      <div class="px-4 py-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Management</p>
        <nav class="space-y-1">
          <NuxtLink to="/overview" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/overview'}">
            <LayoutDashboard class="w-5 h-5" />
            Overview
          </NuxtLink>
          <NuxtLink to="/analytics" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/analytics'}">
            <BarChart2 class="w-5 h-5" />
            Analytics
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/'}">
            <Users class="w-5 h-5" />
            Pending Users
          </NuxtLink>
          <NuxtLink to="/users" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/users'}">
            <Users class="w-5 h-5" />
            Active Users
          </NuxtLink>
          <NuxtLink to="/roles" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/roles'}">
            <Shield class="w-5 h-5" />
            Roles & Perms
          </NuxtLink>
          <NuxtLink to="/vault" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/vault'}">
            <Folder class="w-5 h-5" />
            Vault Management
          </NuxtLink>
          <NuxtLink to="/jobs" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/jobs'}">
            <Briefcase class="w-5 h-5" />
            Career Hub
          </NuxtLink>
          <NuxtLink to="/content" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/content'}">
            <Layers class="w-5 h-5" />
            Content Mgt
          </NuxtLink>
          <NuxtLink to="/enquiries" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/enquiries'}">
            <MessageSquare class="w-5 h-5" />
            Enquiries
          </NuxtLink>
          <NuxtLink to="/subscriptions" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/subscriptions'}">
            <CreditCard class="w-5 h-5" />
            Subscriptions
          </NuxtLink>
          <NuxtLink to="/payments" class="flex items-center gap-3 px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-medium" active-class="bg-gray-800 text-white" :class="{'bg-gray-800 text-white': $route.path === '/payments'}">
            <Wallet class="w-5 h-5" />
            Payments
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

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 sticky top-0 z-10">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-gray-700">Super Admin</span>
          <div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-700 text-xs font-bold">
            SA
          </div>
        </div>
      </header>
      
      <main class="flex-1 overflow-auto p-8">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Users, Folder, Briefcase, LogOut, MessageSquare, CreditCard, Wallet, LayoutDashboard, BarChart2, Shield, Layers } from 'lucide-vue-next';
import { useAuth } from '@/composables/core/useAuth';

const router = useRouter();
const { clearAuth } = useAuth();

const handleLogout = () => {
  clearAuth();
  router.push('/login');
};
</script>
