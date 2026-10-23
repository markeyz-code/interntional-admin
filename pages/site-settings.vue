<template>
  <div class="space-y-8 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Sliders class="w-6 h-6" :class="activeBusiness === 'internTional' ? 'text-brand' : 'text-indigo-600'" />
          Website Configuration & Section Customizer
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Dynamically toggle public sections ON/OFF and configure impact statistics and requirements across UniVerse and InternTional.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Platform Switcher Pill Tabs -->
        <div class="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200">
          <button
            @click="switchPlatform('internTional')"
            :class="selectedPlatform === 'internTional' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-1.5 text-xs rounded-md transition-all flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-brand"></span>
            InternTional
          </button>
          <button
            @click="switchPlatform('uniVerse')"
            :class="selectedPlatform === 'uniVerse' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'"
            class="px-3.5 py-1.5 text-xs rounded-md transition-all flex items-center gap-2"
          >
            <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
            UniVerse
          </button>
        </div>

        <button
          @click="saveSettings"
          :disabled="isSaving || isLoading"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all"
          :class="[
            selectedPlatform === 'internTional'
              ? 'bg-brand hover:bg-[#1f4e70] shadow-brand/20'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
            (isSaving || isLoading) ? 'opacity-60 cursor-not-allowed' : ''
          ]"
        >
          <div v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? 'Saving Changes...' : 'Save Configuration' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-3"></div>
      <p class="text-sm text-gray-500">Loading website configuration for {{ selectedPlatformLabel }}...</p>
    </div>

    <div v-else class="space-y-8">
      <!-- 1. IMPACT & STATISTICS SECTION -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-bold text-gray-900">Impact & Platform Statistics</h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                :class="form.stats.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'"
              >
                {{ form.stats.enabled ? 'Visible on Homepage' : 'Hidden from Homepage' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Toggle the milestone statistics banner below the hero section and configure custom values and labels.
            </p>
          </div>

          <!-- Master Switch -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="form.stats.enabled"
              class="sr-only peer"
            />
            <div class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Section Heading / Description</label>
            <input
              v-model="form.stats.title"
              type="text"
              placeholder="e.g. Platform Impact & Reach"
              class="w-full max-w-lg px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none"
            />
          </div>

          <!-- Metrics Grid Config -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Configured Figures & Metrics ({{ form.stats.metrics.length }})
              </label>
              <button
                @click="addMetric"
                type="button"
                class="text-xs font-semibold flex items-center gap-1.5 transition-colors"
                :class="selectedPlatform === 'internTional' ? 'text-brand hover:text-[#1f4e70]' : 'text-indigo-600 hover:text-indigo-700'"
              >
                <Plus class="w-3.5 h-3.5" /> Add Figure
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="(metric, idx) in form.stats.metrics"
                :key="idx"
                class="p-4 rounded-lg border border-gray-200 bg-gray-50/70 relative group hover:border-gray-300 transition-all"
              >
                <button
                  @click="removeMetric(idx)"
                  class="absolute top-2 right-2 text-gray-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove figure"
                >
                  <Trash2 class="w-4 h-4" />
                </button>

                <div class="space-y-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Figure / Number</label>
                    <input
                      v-model="metric.value"
                      type="text"
                      placeholder="e.g. 5k+, 98%, 150+"
                      class="w-full px-3 py-1.5 text-sm font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Label / Metric</label>
                    <input
                      v-model="metric.label"
                      type="text"
                      placeholder="e.g. Verified Students"
                      class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="mt-6 pt-5 border-t border-gray-100">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Live Homepage Preview</p>
              <div
                v-if="form.stats.enabled"
                class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100 text-center">
                  <div v-for="(metric, idx) in form.stats.metrics" :key="idx" class="px-3">
                    <div class="text-2xl md:text-3xl font-extrabold text-gray-900">{{ metric.value || '0' }}</div>
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{{ metric.label || 'Metric' }}</div>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-xs text-gray-500"
              >
                Statistics section is currently disabled and hidden from the {{ selectedPlatformLabel }} homepage.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. HOMEPAGE SECTION VISIBILITY TOGGLES -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-900">Homepage Section Visibility</h2>
          <p class="text-xs text-gray-500 mt-1">
            Toggle which core sections appear on the landing page for {{ selectedPlatformLabel }}.
          </p>
        </div>

        <div class="p-6 divide-y divide-gray-100">
          <!-- Articles / News Insights -->
          <div class="py-4 flex items-center justify-between gap-4 first:pt-0">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <FileText class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Articles & Insights Section</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays published clinical and academic articles on the homepage.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.articles" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Testimonials -->
          <div class="py-4 flex items-center justify-between gap-4">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <MessageSquare class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Member Testimonials Carousel</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays verified student and intern success stories and reviews.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.testimonials" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Mentorship Section -->
          <div class="py-4 flex items-center justify-between gap-4">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Mentorship Showcase Section</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Highlights expert mentors, senior preceptors, and guidance opportunities.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.mentorship" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Career Hub Section -->
          <div class="py-4 flex items-center justify-between gap-4">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <Briefcase class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Career Hub Feature Section</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Showcases job opportunities, clinical internships, and career readiness.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.career" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Events & Webinars -->
          <div class="py-4 flex items-center justify-between gap-4">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Events & Webinars Section</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays upcoming workshops, academic symposiums, and live sessions.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.events" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Pricing & Membership Plans -->
          <div class="py-4 flex items-center justify-between gap-4 last:pb-0">
            <div class="max-w-xl">
              <div class="flex items-center gap-2">
                <CreditCard class="w-4 h-4 text-gray-500" />
                <h3 class="text-sm font-bold text-gray-900">Pricing & Membership Section</h3>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays subscription tiers and access options.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.sections.pricing" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 3. CAREER HUB POLICIES & UPLOADS -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-900">Career Hub Application Rules</h2>
          <p class="text-xs text-gray-500 mt-1">
            Configure submission policies for job and internship postings on {{ selectedPlatformLabel }}.
          </p>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="max-w-xl">
              <h3 class="text-sm font-bold text-gray-900">Make CV / Resume Upload Mandatory</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                When disabled (recommended for undergraduate students and early interns), candidates can apply directly with their profile, portfolio, and academic details without being blocked by a CV upload requirement.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="form.sections.cvUploadMandatory"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Floating Bottom Save Bar -->
      <div class="flex justify-end pt-4">
        <button
          @click="saveSettings"
          :disabled="isSaving || isLoading"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-all"
          :class="[
            selectedPlatform === 'internTional'
              ? 'bg-brand hover:bg-[#1f4e70] shadow-brand/20'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
            (isSaving || isLoading) ? 'opacity-60 cursor-not-allowed' : ''
          ]"
        >
          <div v-if="isSaving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? 'Saving Changes...' : 'Save Configuration' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  Sliders,
  Save,
  Plus,
  Trash2,
  FileText,
  MessageSquare,
  Users,
  Briefcase,
  Calendar,
  CreditCard
} from 'lucide-vue-next';
import { useBusinessContext, type BusinessType } from '@/composables/core/useBusinessContext';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { siteSettingsApi } from '@/api_factory/modules/siteSettings';

definePageMeta({
  layout: 'default',
});

const { activeBusiness } = useBusinessContext();
const { showToast } = useCustomToast();

const selectedPlatform = ref<BusinessType>(activeBusiness.value);
const isLoading = ref(true);
const isSaving = ref(false);

const selectedPlatformLabel = computed(() =>
  selectedPlatform.value === 'internTional' ? 'InternTional' : 'UniVerse'
);

const form = ref({
  stats: {
    enabled: false,
    title: 'Platform Impact & Community Reach',
    metrics: [
      { value: '5k+', label: 'Verified Students' },
      { value: '10k+', label: 'Study Resources' },
      { value: '150+', label: 'Senior Mentors' },
      { value: '50+', label: 'Partner Labs' },
    ],
  },
  sections: {
    stats: false,
    articles: true,
    testimonials: true,
    mentorship: true,
    career: true,
    events: true,
    pricing: true,
    cvUploadMandatory: false,
  },
});

const fetchSettings = async () => {
  isLoading.value = true;
  try {
    const platformKey = selectedPlatform.value === 'internTional' ? 'interntional' : 'universe';
    const res = await siteSettingsApi.getSettings(platformKey);
    const data = res.data || res;
    if (data) {
      form.value = {
        stats: {
          enabled: data.stats?.enabled ?? false,
          title: data.stats?.title ?? (selectedPlatform.value === 'internTional' ? 'Platform Impact & Milestones' : 'Platform Impact & Student Reach'),
          metrics: data.stats?.metrics && data.stats.metrics.length > 0 ? JSON.parse(JSON.stringify(data.stats.metrics)) : [
            { value: '5k+', label: selectedPlatform.value === 'internTional' ? 'Verified Interns' : 'Verified Students' },
            { value: '10k+', label: 'Study Resources' },
            { value: '150+', label: 'Senior Mentors' },
            { value: '50+', label: 'Partner Labs' },
          ],
        },
        sections: {
          stats: data.sections?.stats ?? false,
          articles: data.sections?.articles ?? true,
          testimonials: data.sections?.testimonials ?? true,
          mentorship: data.sections?.mentorship ?? true,
          career: data.sections?.career ?? true,
          events: data.sections?.events ?? true,
          pricing: data.sections?.pricing ?? true,
          cvUploadMandatory: data.sections?.cvUploadMandatory ?? false,
        },
      };
    }
  } catch (error: any) {
    showToast({
      title: 'Notice',
      message: 'Using default configuration. Save when ready to persist.',
      type: 'info',
    });
  } finally {
    isLoading.value = false;
  }
};

const switchPlatform = (platform: BusinessType) => {
  if (selectedPlatform.value === platform) return;
  selectedPlatform.value = platform;
  fetchSettings();
};

watch(() => activeBusiness.value, (newVal) => {
  if (newVal !== selectedPlatform.value) {
    selectedPlatform.value = newVal;
    fetchSettings();
  }
});

const addMetric = () => {
  form.value.stats.metrics.push({
    value: '100+',
    label: 'New Metric',
  });
};

const removeMetric = (index: number) => {
  form.value.stats.metrics.splice(index, 1);
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    const platformKey = selectedPlatform.value === 'internTional' ? 'interntional' : 'universe';
    
    // Sync sections.stats with stats.enabled
    form.value.sections.stats = form.value.stats.enabled;

    await siteSettingsApi.updateSettings(platformKey, {
      stats: form.value.stats,
      sections: form.value.sections,
    });

    showToast({
      title: 'Saved Successfully',
      message: `Website configuration for ${selectedPlatformLabel.value} has been updated.`,
      type: 'success',
    });
  } catch (err: any) {
    showToast({
      title: 'Error Saving Settings',
      message: err.response?.data?.message || err.message || 'Failed to save configuration.',
      type: 'error',
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>
