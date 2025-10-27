<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import { onClickOutside } from '@vueuse/core';

type ReferralStatus = 'pending' | 'success' | 'rejected';

interface Referral {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: ReferralStatus;
  createdAt: string;
}

const props = withDefaults(defineProps<{
  referrals: Referral[];
  loading: boolean;
  error?: string;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  statusFilter?: ReferralStatus | 'all';
}>(), {
  error: '',
  statusFilter: 'all',
});

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'status-filter-change', status: ReferralStatus | 'all'): void;
  (e: 'search', query: string): void;
  (e: 'update:currentPage', page: number): void;
  (e: 'update:statusFilter', status: ReferralStatus | 'all'): void;
  (e: 'update:itemsPerPage', count: number): void;
}>();

const searchQuery = ref('');
let searchTimeout: number | null = null;

const selectedReferrals = ref<Set<string>>(new Set());
const selectAllCheckbox = ref<HTMLInputElement | null>(null);

watch([() => props.referrals, selectedReferrals], ([refs, selected]) => {
  if (selectAllCheckbox.value) {
    const allSelected = refs.length > 0 && selected.size === refs.length;
    const someSelected = selected.size > 0 && selected.size < refs.length;
    
    selectAllCheckbox.value.indeterminate = someSelected;
  }
}, { deep: true });

const toggleReferralSelection = (referralId: string) => {
  if (selectedReferrals.value.has(referralId)) {
    selectedReferrals.value.delete(referralId);
  } else {
    selectedReferrals.value.add(referralId);
  }
  selectedReferrals.value = new Set(selectedReferrals.value);
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedReferrals.value.clear();
  } else {
    selectedReferrals.value = new Set(props.referrals.map(r => r.id));
  }
  if (selectAllCheckbox.value) {
    selectAllCheckbox.value.indeterminate = false;
  }
};

const allSelected = computed(() => {
  return props.referrals.length > 0 && selectedReferrals.value.size === props.referrals.length;
});
const someSelected = computed(() => {
  return selectedReferrals.value.size > 0 && selectedReferrals.value.size < props.referrals.length;
});
const showStatusDropdown = ref(false);
const statusDropdownRef = ref(null);
const showMobileSearch = ref(false);
const showMobileFilter = ref(false);
const mobileSearchQuery = ref('');
const expandedItems = ref<Set<string>>(new Set());

const toggleItemExpansion = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
  expandedItems.value = new Set(expandedItems.value);
};

let scrollPosition = 0;

watch(showMobileFilter, (isOpen) => {
  if (isOpen) {
    scrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  } else {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollPosition);
  }
});

watch(showMobileSearch, (isOpen) => {
  if (isOpen) {
    scrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  } else {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollPosition);
  }
});

onClickOutside(statusDropdownRef, () => {
  showStatusDropdown.value = false;
});

const statuses = [
  { id: 'all' as const, name: 'All Statuses' },
  { id: 'pending' as const, name: 'Pending' },
  { id: 'success' as const, name: 'Success' },
  { id: 'rejected' as const, name: 'Rejected' }
];

const handleSearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  
  if (searchTimeout !== null) {
    window.clearTimeout(searchTimeout);
  }

  searchTimeout = window.setTimeout(() => {
    emit('search', searchQuery.value);
  }, 300);
};

const handleSearch = (query: string): void => {
  searchQuery.value = query;
  mobileSearchQuery.value = query;
  emit('search', query);
};

const handleMobileSearch = (): void => {
  if (searchTimeout !== null) {
    window.clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    handleSearch(mobileSearchQuery.value);
  }, 300);
};

const handleMobileFilter = (status: ReferralStatus | 'all'): void => {
  onStatusFilterChange(status);
  showMobileFilter.value = false;
};

const onStatusFilterChange = (status: ReferralStatus | 'all'): void => {
  emit('update:statusFilter', status);
};

const onPageChange = (page: number): void => {
  emit('update:currentPage', page);
};

const onItemsPerPageChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  const count = parseInt(target.value, 10);
  emit('update:itemsPerPage', count);
};

const getStatusClass = (status: ReferralStatus): Record<string, boolean> => ({
  'bg-yellow-100 text-yellow-800': status === 'pending',
  'bg-green-100 text-green-800': status === 'success',
  'bg-red-100 text-red-800': status === 'rejected',
});

const getStatusLabel = (status: ReferralStatus): string => {
  const statusMap: Record<ReferralStatus, string> = {
    pending: 'Pending',
    success: 'Success',
    rejected: 'Rejected'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(searchQuery, (newVal) => {
  mobileSearchQuery.value = newVal;
});

onUnmounted(() => {
  if (searchTimeout !== null) {
    window.clearTimeout(searchTimeout);
  }
  
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
});
</script>

<template>
  <!-- Desktop Table -->
  <div class="hidden md:block">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Referral History</h2>
      </div>
    </div>

    <!-- Search and Filter -->
     <div class="flex mt-4">

       <div class="sm:flex sm:items-center justify-between">
         <div class="relative rounded-md shadow-sm max-w-xs w-full mb-4 sm:mb-0">
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <IconSearch class="h-4 w-4 text-gray-400" size="16" />
           </div>
           <input 
             type="text"
             class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             placeholder="Search by name or email" 
             :value="searchQuery" 
             @input="handleSearchInput($event)" />
         </div>
       </div>
   
       <div class="relative flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-200">
         <p class="whitespace-nowrap">Status</p>
         <div class="relative">
           <button 
             @click="showStatusDropdown = !showStatusDropdown" 
             class="flex items-center justify-center h-6 w-6 rounded-full border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
           >
             <IconPlus class="h-3 w-3" />
           </button>
           
           <!-- Dropdown -->
           <div 
             v-if="showStatusDropdown" 
             ref="statusDropdownRef"
             class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
           >
             <button 
               v-for="status in statuses" 
               :key="status.id" 
               @click="
                 $emit('status-filter-change', status.id);
                 showStatusDropdown = false;
               "
               class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
               :class="{ 'bg-blue-50 dark:bg-blue-900': statusFilter === status.id }"
             >
               {{ status.name }}
             </button>
           </div>
         </div>
         
         <!-- Selected status pill -->
         <div class="flex items-center space-x-2 overflow-x-auto pb-1">
           <button 
             v-for="status in statuses.filter(s => statusFilter === s.id)" 
             :key="status.id"
             class="px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 whitespace-nowrap"
           >
             {{ status.name }}
           </button>
         </div>
       </div>
     </div>
    <div v-if="!loading && !error" class="mt-6 flex flex-col">
      <div class="overflow-x-auto p-0.5">
        <div class="">
          <div class="overflow-hidden shadow border border-gray-200 md:rounded-lg">
            <table class="divide-y divide-gray-300 dark:divide-gray-700 w-full">
              <thead class="">
                <tr>
                  <th scope="col" class="relative w-6">
                    <input
                      type="checkbox"
                      ref="selectAllCheckbox"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border border-gray-300
                            appearance-none cursor-pointer
                            bg-transparent checked:bg-blue-600 checked:border-blue-600
                            focus:ring-2 focus:ring-blue-500
                            before:absolute before:inset-0 before:flex before:items-center before:justify-center
                            checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px]"
                      :checked="allSelected"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="referral in referrals" :key="referral.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="relative">
                    <div class="absolute inset-y-0 left-4 flex items-center">
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded border border-gray-300
                              appearance-none cursor-pointer
                              bg-transparent checked:bg-blue-600 checked:border-blue-600
                              focus:ring-2 focus:ring-blue-500
                              before:absolute before:inset-0 before:flex before:items-center before:justify-center
                              checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px]"
                        :checked="selectedReferrals.has(referral.id)"
                        @change="() => toggleReferralSelection(referral.id)"
                      />
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ formatDate(referral.date) }}
                  </td>
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-300 sm:pl-6">
                    {{ referral.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ referral.phone || 'N/A' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {{ referral.email || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="referral.status" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-300">
                    {{ referral.discount || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span v-if="referral.points" class="text-green-600 dark:text-green-400">
                      {{ referral.points }}
                    </span>
                    <span v-else>N/A</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="referrals.length > 0" class="mt-6 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage * itemsPerPage >= totalItems"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
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
            <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Previous</span>
              <IconChevronLeft class="h-5 w-5" aria-hidden="true" />
            </button>

            <!-- Page numbers -->
            <template v-for="page in Math.ceil(totalItems / itemsPerPage)" :key="page">
              <button @click="$emit('page-change', page)" :class="{
                'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200': currentPage === page,
                'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700': currentPage !== page
              }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>
            </template>

            <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage * itemsPerPage >= totalItems"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Next</span>
              <IconChevronRight class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Search Overlay -->
  <div v-if="showMobileSearch" class="fixed inset-0 bg-white dark:bg-gray-900 z-40 flex flex-col overflow-hidden" style="padding-bottom: 5rem;">
    <!-- Search Header -->
    <div class="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center">
        <button 
          @click="showMobileSearch = false"
          class="p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            v-model="mobileSearchQuery"
            @input="handleMobileSearch"
            class="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder="Search by name or email"
            autofocus
          />
          <button 
            v-if="mobileSearchQuery"
            @click="mobileSearchQuery = ''; handleMobileSearch()"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="flex items-center justify-center p-4">
        <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Searching...</span>
      </div>
      <div v-else-if="mobileSearchQuery && referrals.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
        No results found
      </div>
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="referral in referrals" 
          :key="referral.id" 
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ referral.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ referral.email || 'No email' }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(referral.date) }}
              </p>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ referral.points ? `৳${referral.points}` : 'N/A' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Filter Overlay -->
  <div v-if="showMobileFilter" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-20" @click.self="showMobileFilter = false">
    <div class="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filter by Status</h3>
        <button @click="showMobileFilter = false" class="text-gray-400 hover:text-gray-500">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="space-y-2">
        <button
          v-for="status in statuses"
          :key="status.id"
          @click="handleMobileFilter(status.id)"
          class="w-full text-left px-4 py-2 text-sm rounded-md"
          :class="{
            'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100': statusFilter === status.id,
            'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700': statusFilter !== status.id
          }"
        >
          {{ status.name }}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile List -->
  <div class="md:hidden space-y-2 mt-4">
    <div class="flex justify-between">
      <h4 class="text-xl text-gray-700 dark:text-gray-200">Referral History</h4>
      <div class="flex gap-2 text-gray-700 dark:text-gray-200">
        <button 
          @click="showMobileSearch = true"
          class="rounded-full p-2 border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-100 dark:bg-gray-700': showMobileSearch }"
        >
          <IconSearch class="h-5 w-5" />
        </button>
        <button 
          @click="showMobileFilter = true"
          class="rounded-full p-2 border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-100 dark:bg-gray-700': showMobileFilter }"
        >
          <IconListFilter class="h-5 w-5" />
        </button>
      </div>
    </div>
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Name & Date</span>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Points</span>
    </div>

    <!-- Items -->
    <div v-for="referral in referrals" :key="referral.id"
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:rounded-b-lg last:border-0 overflow-hidden">
      <div class="flex items-center justify-between p-3 cursor-pointer" @click="toggleItemExpansion(referral.id)">
        <div class="flex items-start gap-2">
          <div 
            class="flex items-center border border-gray-300 rounded-sm p-0.5"
            :class="{
              'bg-blue-500 text-white': expandedItems.has(referral.id)
            }"
            >
            <IconMinus v-if="expandedItems.has(referral.id)" class="w-2.5 h-2.5" />
            <IconPlus v-else class="w-2.5 h-2.5" />
          </div>
          <div class="flex flex-col items-start">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ referral.name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ formatDate(referral.date) }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <span v-if="referral.points"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
            ৳ {{ referral.points }}
          </span>
          <span v-else class="text-sm text-gray-500 dark:text-gray-400 px-2.5 mr-2">N/A</span>
          
        </div>
      </div>
      <!-- Expanded Content with Transition -->
      <transition
        enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-96 opacity-100"
        leave-active-class="transition-all duration-300 ease-in-out overflow-hidden"
        leave-from-class="max-h-96 opacity-100"
        leave-to-class="max-h-0 opacity-0"
        @before-enter="el => el.style.maxHeight = '0'"
        @enter="el => el.style.maxHeight = el.scrollHeight + 'px'"
        @before-leave="el => el.style.maxHeight = el.scrollHeight + 'px'"
        @after-enter="el => el.style.maxHeight = 'none'"
        @leave="el => (el.style.maxHeight = '0')"
      >
        <div v-show="expandedItems.has(referral.id)" class="p-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div class="grid grid-cols-2 gap-1 text-sm">
            <div>
              <p class="text-gray-900 dark:text-white">{{ referral.phone || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-900 dark:text-white truncate">{{ referral.email || 'N/A' }}</p>
            </div>
            <div class="inline-flex gap-2">
              <p class="text-gray-500 dark:text-gray-400">Referral Code</p>
              <p class="text-gray-900 dark:text-white">{{ referral.referralCode || 'N/A' }}</p>
            </div>
            <div class="flex gap-2">
              <p class="text-gray-500 dark:text-gray-400">Status</p>
              <StatusBadge :status="referral.status" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>


</template>
