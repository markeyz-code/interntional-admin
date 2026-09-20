<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section class="text-center max-w-2xl mx-auto pt-8">
      <span class="text-sm font-semibold text-brand tracking-wider uppercase mb-2 block">Content</span>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Manage everything</h1>
      <p class="text-lg text-gray-600">
        Build your community with tools that work the way you think.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <button class="px-6 py-2.5 bg-brand text-white rounded font-medium hover:bg-[#1f4e70] transition-colors">
          New Post
        </button>
        <button class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors">
          View Site
        </button>
      </div>
    </section>

    <!-- Organize Content -->
    <section class="bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8 py-16 text-center">
      <span class="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-2 block">Organize</span>
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Keep your community moving forward</h2>
      <p class="text-gray-600 mb-10 max-w-xl mx-auto">Handle the work that matters. Post jobs, update resources, and share knowledge without friction. Your team stays focused on building something real.</p>
      
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
         <!-- Card 1 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-48 bg-gray-200">
               <img src="https://placehold.co/600x400" class="w-full h-full object-cover" />
            </div>
            <div class="p-6 text-center flex-grow flex flex-col">
               <h3 class="text-xl font-bold text-gray-900 mb-3">Add and edit vault resources</h3>
               <p class="text-sm text-gray-600 mb-6 flex-grow">Upload documents and materials that interns need to succeed.</p>
            </div>
         </div>
         <!-- Card 2 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-48 bg-gray-200">
               <img src="/admin_chart.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="p-6 text-center flex-grow flex flex-col">
               <h3 class="text-xl font-bold text-gray-900 mb-3">Post new job and scholarship listings</h3>
               <p class="text-sm text-gray-600 mb-6 flex-grow">Keep opportunities fresh and let interns find what fits their path.</p>
            </div>
         </div>
         <!-- Card 3 -->
         <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-48 bg-gray-900 flex items-center justify-center group cursor-pointer relative">
               <img src="/admin_chart.jpg" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
               <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                 <Play class="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
               </div>
            </div>
            <div class="p-6 text-center flex-grow flex flex-col">
               <h3 class="text-xl font-bold text-gray-900 mb-3">Update the video gallery for webinars</h3>
               <p class="text-sm text-gray-600 mb-6 flex-grow">Share learning sessions and keep content current for your community.</p>
            </div>
         </div>
      </div>
      <div class="mt-8 flex justify-center items-center gap-4">
         <button class="px-5 py-2 border border-gray-300 bg-white rounded text-sm font-medium text-gray-700 hover:bg-gray-50">Explore</button>
         <button class="text-sm text-gray-400">&rarr;</button>
      </div>
    </section>

    <!-- Side by Side Content Editor Preview -->
    <section class="py-16 max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
      <div class="md:w-1/4">
        <h3 class="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Getting started</h3>
        <ul class="space-y-2 text-sm">
          <li>
            <button class="w-full text-left px-3 py-2 rounded bg-white border border-gray-300 font-medium text-gray-900 shadow-sm">
              Upload Textbook
            </button>
          </li>
          <li>
            <button class="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600">
              Council Past Questions
            </button>
          </li>
          <li>
            <button class="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600">
              Manage Categories
            </button>
          </li>
          <li>
            <button class="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600">
              Drafts & Scheduled
            </button>
          </li>
          <li>
            <button class="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-gray-600">
              Vault Archives
            </button>
          </li>
        </ul>
      </div>
      <div class="md:w-3/4 bg-white border border-gray-200 rounded-xl p-8 shadow-sm prose prose-brand max-w-none">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Clinical Hematology Overview</h2>
        <p class="text-sm font-semibold text-gray-900 mb-4">Clinical Hematology is the study of blood cells and coagulation.</p>
        <p class="text-gray-600 mb-8">This section covers the morphology of red blood cells, white blood cells, and platelets. Interns should focus on identifying common abnormalities such as microcytic anemia and leukocytosis in peripheral blood smears.</p>

        <h3 class="text-xl font-bold text-gray-900 mb-2 mt-8">Laboratory Safety & SOPs</h3>
        <p class="text-gray-600 mb-4">All laboratory personnel must adhere to universal precautions.</p>
        <p class="text-gray-600 mb-8">This includes the mandatory use of Personal Protective Equipment (PPE) such as lab coats, gloves, and face shields. Proper disposal of bio-hazardous waste in designated sharps container and autoclave bags is essential for infection control.</p>

        <h3 class="text-xl font-bold text-gray-900 mb-2 mt-8">Chemical Pathology Reference Ranges</h3>
        <p class="text-gray-600 mb-8">Reference ranges are critical for the interpretation of patient results. This guide provides the standard values for Electrolytes, Urea, and Creatinine (EUC), as well as Liver Function Test (LFTs). Always ensure the biochemistry analyzer is calibrated against known standards before processing daily samples.</p>

        <h3 class="text-xl font-bold text-gray-900 mb-2 mt-8">Microbiology Staining Techniques</h3>
        <p class="text-gray-600 mb-6">Gram staining remains the gold standard for preliminary bacterial identification. This resource details the four-step process: Primary Stain (Crystal Violet), Mordant (Iodine), Decolorizer (Alcohol), and Counterstain (Safranin). Accuracy in heat - fixing is vital for maintaining cell wall integrity.</p>

        <blockquote class="border-l-4 border-gray-300 pl-4 py-1 italic text-gray-600 bg-gray-50 mb-8 text-sm">
          "The accuracy of a laboratory result begins at the pre-analytical stage. Proper patient identification and sample collection are the foundation of a correct diagnostic."
        </blockquote>
      </div>
    </section>

    <!-- Real voices -->
    <section class="py-12 bg-white flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto border-t border-gray-100">
      <div class="md:w-1/3">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Real voices</h2>
        <p class="text-gray-600">What admins are saying.</p>
      </div>
      <div class="md:w-2/3 bg-gray-50 p-8 rounded-xl border border-gray-200">
         <div class="flex text-yellow-400 mb-4">
           <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
         </div>
         <p class="text-lg text-gray-900 font-medium mb-6">"The CMS made managing our community effortless and intuitive."</p>
         <div class="flex items-center gap-3">
           <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">SM</div>
           <div>
             <h4 class="text-sm font-bold text-gray-900">Sarah Mitchell</h4>
             <p class="text-xs text-gray-500">Community Manager, MLS</p>
           </div>
         </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="rounded-2xl overflow-hidden relative shadow-lg my-12 max-w-5xl mx-auto">
      <div class="absolute inset-0 bg-gray-900/60 z-10 mix-blend-multiply"></div>
      <img src="/admin_chart.jpg" class="absolute inset-0 w-full h-full object-cover" />
      <div class="relative z-20 py-20 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to build something real?</h2>
        <p class="text-lg text-gray-200 mb-8 max-w-xl mx-auto">Start creating content and shaping your community today with our tools.</p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-3 bg-white text-gray-900 rounded font-bold hover:bg-gray-100 transition-colors">Create</button>
          <button class="px-8 py-3 bg-transparent border border-white text-white rounded font-bold hover:bg-white/10 transition-colors">Explore</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports';
import { Play, Star } from 'lucide-vue-next';

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Content Management | Admin' });
useHead({ title: 'Content Management | Admin' });
</script>
