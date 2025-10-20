<script lang="ts">
import { defineComponent } from 'vue';
import { CheckCircleIcon, ClockIcon, XCircleIcon, SearchIcon } from '@heroicons/vue/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid';

export default defineComponent({
  props: {
    referrals: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      default: null
    },
    totalItems: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    statusFilter: {
      type: String,
      required: true
    }
  },

  emits: ['page-change', 'status-filter-change', 'search'],

  data() {
    return {
      searchTimeout: null as ReturnType<typeof setTimeout> | null,
      statuses: [
        { name: 'All', value: 'all' },
        { name: 'Pending', value: 'pending' },
        { name: 'Approved', value: 'approved' },
        { name: 'Rejected', value: 'rejected' },
      ],
      searchQuery: ''
    };
  },

  methods: {
    handleSearch(value: string) {
      this.searchTimeout = setTimeout(() => {
        this.$emit('search', value as string);
      }, 300);
    },
    formatDate(dateString: string): string {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  components: {
    StatusBadge: {
      props: {
        status: {
          type: String,
          required: true
        }
      },
      data() {
        const statusConfig = {
          pending: {
            classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            icon: 'ClockIcon',
            text: 'Pending'
          },
          approved: {
            classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            icon: 'CheckCircleIcon',
            text: 'Approved'
          },
          rejected: {
            classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            icon: 'XCircleIcon',
            text: 'Rejected'
          }
        };

        const config = statusConfig[this.status as keyof typeof statusConfig] || statusConfig.pending;
        
        return {
          baseClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          config
        };
      },
      components: {
        CheckCircleIcon,
        ClockIcon,
        XCircleIcon
      },
      template: `
        <span :class="[baseClasses, config.classes]">
          <component :is="config.icon" class="-ml-0.5 mr-1 h-3 w-3" />
          {{ config.text }}
        </span>
      `
    },
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  }
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Referral History</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Track all your referrals and their status
        </p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="mt-4 sm:flex sm:items-center justify-between">
      <div class="relative rounded-md shadow-sm max-w-xs w-full mb-4 sm:mb-0">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name or email"
          :value="searchQuery"
          @input="(e) => { searchQuery = e.target.value; handleSearch(e.target.value); }"
        />
      </div>
      
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="status in statuses"
          :key="status.value"
          @click="$emit('status-filter-change', status.value)"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="{
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100': statusFilter === status.value,
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': statusFilter !== status.value
          }"
        >
          {{ status.name }}
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mt-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Error loading referrals
          </h3>
          <div class="mt-2 text-sm text-red-700 dark:text-red-300">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="mt-8 space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="referrals.length === 0" class="mt-12 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No referrals found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding a new referral.
      </p>
    </div>

    <!-- Desktop Table -->
    <div v-if="!loading && !error" class="mt-6 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                <tr v-for="referral in referrals" :key="referral.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {{ referral.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ referral.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ referral.phone || 'N/A' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge :status="referral.status" />
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ formatDate(referral.date) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile List -->
    <div v-else class="mt-6 sm:hidden space-y-4">
      <div v-for="referral in referrals" :key="referral.id" class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ referral.name }}</h3>
          <StatusBadge :status="referral.status" />
        </div>
        <div class="mt-2 text-sm text-gray-500 dark:text-gray-300">
          {{ referral.email }}
        </div>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ referral.phone || 'No phone' }}
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(referral.date) }}
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="referrals.length > 0" class="mt-6 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage * itemsPerPage >= totalItems"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> of
            <span class="font-medium">{{ totalItems }}</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="$emit('page-change', currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            
            <!-- Page numbers -->
            <template v-for="page in Math.ceil(totalItems / itemsPerPage)" :key="page">
              <button
                @click="$emit('page-change', page)"
                :class="{
                  'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200': currentPage === page,
                  'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700': currentPage !== page
                }"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {{ page }}
              </button>
            </template>
            
            <button
              @click="$emit('page-change', currentPage + 1)"
              :disabled="currentPage * itemsPerPage >= totalItems"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
