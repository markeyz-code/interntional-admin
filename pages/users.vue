<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center max-w-2xl mx-auto pt-8">
      <span class="text-sm font-semibold text-brand tracking-wider uppercase mb-2 block">Admin</span>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Manage your people</h1>
      <p class="text-lg text-gray-600">
        Assign roles, understand who accesses what, and keep tabs on the community with powerful tools.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <button class="px-6 py-2.5 bg-brand text-white rounded font-medium hover:bg-[#1f4e70] transition-colors">
          Start
        </button>
        <button class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors">
          Learn
        </button>
      </div>
    </section>

    <!-- Alternating Features -->
    <section class="py-12 bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8">
      <div class="max-w-5xl mx-auto space-y-24">
        
        <!-- Feature 1 -->
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">01 Search users</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Find members in seconds with powerful search</h2>
            <p class="text-gray-600 mb-6">Look up users by email, name, or role. Filter by status, review dates, or recent activity. Spend less time hunting and more time managing.</p>
            <div class="flex gap-4">
              <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Search</button>
              <button class="text-sm text-brand font-medium hover:underline">Learn more &rarr;</button>
            </div>
          </div>
          <div class="md:w-1/2">
             <img src="/admin_chart.jpg" alt="Search Interface" class="rounded-xl shadow-lg w-full" />
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col md:flex-row-reverse items-center gap-12">
          <div class="md:w-1/2">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">02 Edit profiles</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Update user information with ease</h2>
            <p class="text-gray-600 mb-6">Modify contact details, profile information, and account settings for any member. Changes sync instantly across the platform.</p>
            <div class="flex gap-4">
              <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Manage</button>
              <button class="text-sm text-brand font-medium hover:underline">Learn more &rarr;</button>
            </div>
          </div>
          <div class="md:w-1/2">
             <div class="bg-gray-200 rounded-xl h-64 w-full shadow-lg border border-gray-300 flex items-center justify-center p-8 bg-cover" style="background-image: url('/admin_chart.jpg')">
               <!-- visual placeholder -->
             </div>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">03 Access levels</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Grant permissions with precision</h2>
            <p class="text-gray-600 mb-6">Dictate who sees what content. Restrict access, lock down secure vaults, and grant moderator rights to trusted community members.</p>
            <div class="flex gap-4">
              <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Configure</button>
              <button class="text-sm text-brand font-medium hover:underline">Learn more &rarr;</button>
            </div>
          </div>
          <div class="md:w-1/2">
             <img src="/admin_chart.jpg" alt="Permissions" class="rounded-xl shadow-lg w-full mix-blend-luminosity" />
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="flex flex-col md:flex-row-reverse items-center gap-12">
          <div class="md:w-1/2">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">04 Product analytics</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Monitor user engagement and behavior</h2>
            <p class="text-gray-600 mb-6">Track login history, download metrics, and job board interactions. Spot trends that can help you improve the community experience.</p>
            <div class="flex gap-4">
              <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Verify</button>
              <button class="text-sm text-brand font-medium hover:underline">Learn more &rarr;</button>
            </div>
          </div>
          <div class="md:w-1/2">
             <img src="/admin_chart.jpg" alt="Analytics" class="rounded-xl shadow-lg w-full" />
          </div>
        </div>

      </div>
    </section>

    <!-- Know what each role can do -->
    <section class="py-16 max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Clarity</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Know what each role can do</h2>
        <p class="text-gray-600">Clear rules stop confusion. Here is what happens within your flat hierarchy.</p>
      </div>

      <div class="overflow-x-auto bg-white rounded-xl border border-gray-200">
        <table class="w-full text-left text-sm">
          <thead>
            <tr>
              <th class="p-6 border-b border-gray-200 font-bold text-gray-900">Role Permissions</th>
              <th class="p-6 border-b border-gray-200 font-bold text-gray-900 text-center bg-gray-50">Super Admin</th>
              <th class="p-6 border-b border-gray-200 font-bold text-gray-900 text-center">Moderator</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="p-6 text-gray-700">Dashboard management</td>
              <td class="p-6 text-center bg-gray-50 font-medium">Yes</td>
              <td class="p-6 text-center text-gray-500">No</td>
            </tr>
            <tr>
              <td class="p-6 text-gray-700">Approve document uploads</td>
              <td class="p-6 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-6 text-center"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-6 text-gray-700">View accounting and revenue</td>
              <td class="p-6 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-6 text-center text-gray-500"><X class="w-4 h-4 text-gray-300 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-6 text-gray-700">Modify and create Subscriptions</td>
              <td class="p-6 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-6 text-center text-gray-500"><X class="w-4 h-4 text-gray-300 mx-auto" /></td>
            </tr>
            <tr>
              <td class="p-6 text-gray-700">Banish and mute rule breakers</td>
              <td class="p-6 text-center bg-gray-50"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
              <td class="p-6 text-center"><Check class="w-5 h-5 text-gray-900 mx-auto" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center mt-8">
         <button class="px-6 py-2 border border-gray-300 bg-white rounded font-medium text-gray-700 hover:bg-gray-50 mr-2">Compare</button>
         <button class="px-6 py-2 bg-gray-100 rounded font-medium text-brand hover:bg-gray-200">Learn &rarr;</button>
      </div>
    </section>

    <!-- Our Team -->
    <section class="py-16 bg-white border-t border-b border-gray-200 -mx-6 lg:-mx-8 px-6 lg:px-8 text-center">
      <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Leadership</span>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Our team</h2>
      <p class="text-gray-600 mb-12">The people who keep things running smoothly.</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <!-- Team Member 1 -->
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400">
             <User class="w-8 h-8"/>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">Sarah Mitchell</h4>
          <p class="text-xs text-brand font-medium mb-2">Platform Director</p>
          <p class="text-xs text-gray-500 text-center">Oversees all platform operations and community standards enforcement across the network.</p>
        </div>
        <!-- Team Member 2 -->
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400">
             <User class="w-8 h-8"/>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">James Chen</h4>
          <p class="text-xs text-brand font-medium mb-2">Operations Lead</p>
          <p class="text-xs text-gray-500 text-center">Handles document review queues, account approvals, and user operations.</p>
        </div>
        <!-- Team Member 3 -->
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400">
             <User class="w-8 h-8"/>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">Maria Rodriguez</h4>
          <p class="text-xs text-brand font-medium mb-2">Community Manager</p>
          <p class="text-xs text-gray-500 text-center">Manages communication, user feedback, and enforces forum guidelines.</p>
        </div>
        <!-- Team Member 4 -->
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400">
             <User class="w-8 h-8"/>
          </div>
          <h4 class="font-bold text-gray-900 text-sm">David Thompson</h4>
          <p class="text-xs text-brand font-medium mb-2">Security Officer</p>
          <p class="text-xs text-gray-500 text-center">Monitors access control, permissions and audits admin activities.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Questions</h2>
        <p class="text-gray-600">Everything you need to know about managing users and permissions.</p>
      </div>

      <div class="space-y-4">
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            How do I reset an intern's password?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            Use the search tool to find the user. In their profile view, click "Reset Password". A secure link will be emailed to their registered address automatically.
          </div>
        </details>
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            Can I change a user's access level?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            Yes. Navigate to their profile, select the 'Roles' tab, and assign the appropriate tier (e.g. Moderator, Subscriber, Intern). Changes take effect on their next page load.
          </div>
        </details>
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            What happens when I ban an account?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            Banning a user revokes their access immediately. Their active sessions are terminated. They can never re-register using the banned email address without admin intervention.
          </div>
        </details>
      </div>
      
      <div class="text-center mt-12">
        <h4 class="font-bold text-gray-900 mb-2">Need more help?</h4>
        <p class="text-sm text-gray-600 mb-4">Reach out to our support team for assistance.</p>
        <button class="px-6 py-2 border border-brand text-brand hover:bg-brand/5 rounded font-medium transition-colors">Contact</button>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="rounded-2xl bg-gray-900 text-center py-20 my-16 shadow-lg max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Ready to add new members?</h2>
      <p class="text-lg text-gray-300 mb-8 max-w-xl mx-auto">Invite new users manually or edit roles for those who are already in.</p>
      <div class="flex justify-center gap-4">
        <button class="px-8 py-3 bg-white text-gray-900 rounded font-bold hover:bg-gray-100 transition-colors">Invite User</button>
        <button class="px-8 py-3 bg-transparent border border-white text-white rounded font-bold hover:bg-white/10 transition-colors">Learn more</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports';
import { Check, X, User } from 'lucide-vue-next';

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Users Management | Admin' });
useHead({ title: 'Users Management | Admin' });
</script>
