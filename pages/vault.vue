<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center max-w-2xl mx-auto pt-8">
      <span class="text-sm font-semibold text-brand tracking-wider uppercase mb-2 block">Verify</span>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Review submissions</h1>
      <p class="text-lg text-gray-600">
        Check intern documents with precision. Approve or request changes quickly.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <button class="px-6 py-2.5 bg-brand text-white rounded font-medium hover:bg-[#1f4e70] transition-colors">
          Review
        </button>
        <button class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors">
          Learn
        </button>
      </div>
    </section>

    <!-- Manage the review queue -->
    <section class="text-center pt-8 max-w-6xl mx-auto">
      <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Process</span>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Manage the review queue</h2>
      <p class="text-gray-600 mb-12">See all pending submissions waiting for your attention.</p>

      <div class="grid md:grid-cols-3 gap-6 text-left">
        <!-- Card 1 -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div class="h-40 bg-gray-100">
             <img src="/admin_chart.jpg" class="w-full h-full object-cover" />
          </div>
          <div class="p-6 flex-grow">
             <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Queue</span>
             <h3 class="text-xl font-bold text-gray-900 mb-3">View pending documents</h3>
             <p class="text-sm text-gray-600 mb-6">Assess the full list of submissions in review.</p>
             <button class="text-sm font-medium text-brand hover:underline mt-auto">Open &rarr;</button>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div class="h-40 bg-gray-100">
             <img src="https://placehold.co/600x400" class="w-full h-full object-cover" />
          </div>
          <div class="p-6 flex-grow">
             <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Preview</span>
             <h3 class="text-xl font-bold text-gray-900 mb-3">Examine document details</h3>
             <p class="text-sm text-gray-600 mb-6">View files side by side for careful inspection.</p>
             <button class="text-sm font-medium text-brand hover:underline mt-auto">View &rarr;</button>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div class="h-40 bg-gray-100">
             <img src="/admin_chart.jpg" class="w-full h-full object-cover mix-blend-luminosity" />
          </div>
          <div class="p-6 flex-grow">
             <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Approve or request changes immediately</span>
             <h3 class="text-xl font-bold text-gray-900 mb-3">Make decisions and send feedback to interns</h3>
             <p class="text-sm text-gray-600 mb-6">Take action on each submission with notes.</p>
             <button class="text-sm font-medium text-brand hover:underline mt-auto">Details &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Examine side by side -->
    <section class="py-16 bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-16">
        <div class="md:w-1/2">
          <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Review</span>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Examine intern documents side by side</h2>
          <p class="text-lg text-gray-600 mb-12">Compare materials and verify authenticity. Add notes before making your decision.</p>
          
          <div class="grid grid-cols-2 gap-8 mb-8">
             <div>
               <h3 class="text-2xl font-bold text-gray-900 mb-2">Internship letter</h3>
               <p class="text-sm text-gray-500">Official documentation from the employer</p>
             </div>
             <div>
               <h3 class="text-2xl font-bold text-gray-900 mb-2">Lab ID</h3>
               <p class="text-sm text-gray-500">Identification and verification materials</p>
             </div>
          </div>
          
          <div class="flex gap-4">
             <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-100">Reject</button>
             <button class="text-sm text-brand font-medium hover:underline">Approve &rarr;</button>
          </div>
        </div>
        <div class="md:w-1/2 w-full">
           <img src="https://placehold.co/600x400" alt="Side by side review" class="rounded-xl shadow-lg w-full" />
        </div>
      </div>
    </section>

    <!-- Submit your feedback -->
    <section class="py-16 max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-center gap-16">
        <div class="md:w-1/2">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Submit your feedback</h2>
          <p class="text-gray-600 mb-8">Leave detailed comments on submissions and decide on approval or revision requests.</p>
          
          <div class="flex gap-4 items-center">
             <input type="text" placeholder="Reason for rejection (Optional)" class="flex-grow px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-gray-50 text-sm" />
             <button class="px-6 py-3 bg-brand text-white rounded font-medium hover:bg-[#1f4e70] transition-colors whitespace-nowrap">
               Submit review
             </button>
          </div>
        </div>
        <div class="md:w-1/2">
           <img src="/admin_chart.jpg" alt="Feedback form" class="rounded-xl shadow-lg w-full mix-blend-multiply opacity-80" />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Questions</h2>
        <p class="text-gray-600">Find answers about the review process and what happens next.</p>
      </div>

      <div class="space-y-4">
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            What documents require review?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            All intern submissions including resumes, certifications, and portfolio materials go through our review process. We check for completeness and authenticity before approval.
          </div>
        </details>
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            How long does review take?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            Most documents are reviewed within two business days. Complex submissions may take longer depending on the materials provided.
          </div>
        </details>
        <details class="group bg-white rounded-lg border border-gray-200 open:ring-1 open:ring-gray-200">
          <summary class="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
            Can interns resubmit after rejection?
            <span class="transition group-open:rotate-180">+</span>
          </summary>
          <div class="px-6 pb-6 text-gray-600">
            Yes. Interns receive detailed feedback on why documents were rejected and can resubmit corrected versions immediately.
          </div>
        </details>
      </div>

      <div class="text-center mt-12">
        <h4 class="font-bold text-gray-900 mb-2">Need more help?</h4>
        <p class="text-sm text-gray-600 mb-4">Reach out to our support team for additional guidance.</p>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports';

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Review Submissions | Admin' });
useHead({ title: 'Review Submissions | Admin' });
</script>
