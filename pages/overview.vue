<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center max-w-3xl mx-auto pt-8">
      <span class="text-sm font-semibold text-brand tracking-wider uppercase mb-2 block">Control</span>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Run the operation</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Manage users, review documents, and shape the community from one place.
      </p>
      <div class="flex justify-center gap-4">
        <button class="px-6 py-2.5 bg-brand text-white rounded font-medium hover:bg-[#1f4e70] transition-colors">
          Start
        </button>
        <button class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors">
          Learn more
        </button>
      </div>
    </section>

    <!-- Core tools tabs (Visual mockup) -->
    <section class="bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8 py-16 text-center">
      <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Manage</span>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Core tools at your fingertips</h2>
      <p class="text-gray-600 mb-10 max-w-xl mx-auto">Everything you need to run the community sits in one place. Switch between tasks without losing your way.</p>
      
      <div class="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
         <div class="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-brand text-brand bg-gray-50">Users</button>
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-transparent text-gray-600 hover:bg-gray-50">Documents</button>
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-transparent text-gray-600 hover:bg-gray-50">Content</button>
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-transparent text-gray-600 hover:bg-gray-50">Rules</button>
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-transparent text-gray-600 hover:bg-gray-50">Reports</button>
            <button class="px-8 py-4 font-semibold text-sm border-b-2 border-transparent text-gray-600 hover:bg-gray-50">Settings</button>
         </div>
         <div class="p-8 flex flex-col md:flex-row gap-8 items-center text-left">
           <div class="md:w-1/2">
             <span class="text-xs font-semibold text-gray-400 uppercase mb-2 block">Users</span>
             <h3 class="text-2xl font-bold text-gray-900 mb-4">Create accounts and assign permissions</h3>
             <p class="text-sm text-gray-600 mb-6">Add new interns, set their roles, and control what they can access. Manage permissions by role or create custom access levels for specific team members.</p>
             <div class="flex gap-4">
                <button class="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">Manage</button>
                <button class="text-sm font-medium text-brand hover:underline">Learn &rarr;</button>
             </div>
           </div>
           <div class="md:w-1/2">
             <img src="/admin_chart.jpg" class="rounded-lg shadow w-full" />
           </div>
         </div>
      </div>
    </section>

    <!-- What each role can do (Feature Matrix) -->
    <section class="py-16 max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Access</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">What each role can do</h2>
        <p class="text-gray-600">Compare permissions across admin levels and see what each role controls.</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-b border-gray-200">
          <thead>
            <tr>
              <th class="p-4 border-b border-gray-200 font-bold text-gray-900">Feature</th>
              <th class="p-4 border-b border-gray-200 font-bold text-gray-900 text-center bg-gray-50">Super Admin</th>
              <th class="p-4 border-b border-gray-200 font-bold text-gray-900 text-center">Moderator</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="p-4 text-gray-700">User management</td>
              <td class="p-4 text-center bg-gray-50 font-medium">Yes</td>
              <td class="p-4 text-center text-gray-500">No</td>
            </tr>
            <tr>
              <td class="p-4 text-gray-700">Document review</td>
              <td class="p-4 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-4 text-center"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-4 text-gray-700">Content management</td>
              <td class="p-4 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-4 text-center"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-4 text-gray-700">Role assignment</td>
              <td class="p-4 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-4 text-center text-gray-500"><X class="w-4 h-4 text-gray-300 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-4 text-gray-700">System reports</td>
              <td class="p-4 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-4 text-center text-gray-500"><X class="w-4 h-4 text-gray-300 mx-auto" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center mt-8">
         <button class="px-5 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-brand font-medium hover:bg-gray-100">Compare All &rarr;</button>
      </div>
    </section>

    <!-- Platform at a glance -->
    <section class="py-16">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Numbers</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Your platform at a glance</h2>
        <p class="text-gray-600">Real-time metrics show the health and activity of your community.</p>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
        <div class="md:w-1/3 space-y-8 pl-8">
          <div>
            <div class="text-5xl font-black text-gray-900 mb-1">847</div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Interns</div>
          </div>
          <div>
            <div class="text-5xl font-black text-gray-900 mb-1">23</div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending approvals</div>
          </div>
          <div>
            <div class="text-5xl font-black text-gray-900 mb-1">99</div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Subscriptions</div>
          </div>
        </div>
        <div class="md:w-2/3 w-full relative">
          <!-- Video/Chart Placeholder -->
          <div class="aspect-video bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center group cursor-pointer shadow-lg">
            <img src="/admin_chart.jpg" class="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform z-10">
              <Play class="w-6 h-6 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Built for administration -->
    <section class="bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8 py-16">
      <div class="text-center mb-12 max-w-2xl mx-auto">
        <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Tools</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Built for administration</h2>
        <p class="text-gray-600">Three core systems handle everything you need to run the operation.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
         <!-- Card 1 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-40 bg-gray-200">
               <img src="/admin_chart.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="p-6 flex-grow">
               <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Users</span>
               <h3 class="text-xl font-bold text-gray-900 mb-3">User management system</h3>
               <p class="text-sm text-gray-600 mb-6">Create accounts, assign roles, and manage permissions across the platform.</p>
               <button class="text-sm font-medium text-brand hover:underline mt-auto">Manage &rarr;</button>
            </div>
         </div>
         <!-- Card 2 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-40 bg-gray-200">
               <img src="/admin_chart.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="p-6 flex-grow">
               <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Documents</span>
               <h3 class="text-xl font-bold text-gray-900 mb-3">Document review queue</h3>
               <p class="text-sm text-gray-600 mb-6">Review submissions, leave feedback, and approve or reject in reviews.</p>
               <button class="text-sm font-medium text-brand hover:underline mt-auto">Review &rarr;</button>
            </div>
         </div>
         <!-- Card 3 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-40 bg-gray-200">
               <img src="/admin_chart.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="p-6 flex-grow">
               <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Content</span>
               <h3 class="text-xl font-bold text-gray-900 mb-3">Content management system</h3>
               <p class="text-sm text-gray-600 mb-6">Build pages, manage content blocks, and publish updates without code.</p>
               <button class="text-sm font-medium text-brand hover:underline mt-auto">Manage &rarr;</button>
            </div>
         </div>
      </div>
    </section>

    <!-- Real feedback -->
    <section class="py-12 bg-white flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto border-t border-gray-100">
      <div class="md:w-1/3">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Real feedback</h2>
        <p class="text-gray-600">What admins say about managing this platform.</p>
      </div>
      <div class="md:w-2/3 bg-gray-50 p-8 rounded-xl border border-gray-200">
         <div class="flex text-yellow-400 mb-4">
           <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
         </div>
         <p class="text-lg text-gray-900 font-medium mb-6">"The dashboard makes it simple to handle everything without getting lost in menus."</p>
         <div class="flex items-center gap-3">
           <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">SM</div>
           <div>
             <h4 class="text-sm font-bold text-gray-900">Sarah Mitchell</h4>
             <p class="text-xs text-gray-500">Community Manager</p>
           </div>
         </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports';
import { Play, Check, X, Star } from 'lucide-vue-next';

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Admin Overview | InternTional Ecosystem' });
useHead({ title: 'Admin Overview | InternTional Ecosystem' });
</script>
