<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useReferralStore } from '@/stores/referral.store';
import { usePointsStore } from '@/stores/points.store';
import CopyReferralLink from '@/components/referral/CopyReferralLink.vue';
import ReferralHistoryTable from '@/components/referral/ReferralHistoryTable.vue';
import ReferralForm from '@/components/referral/ReferralForm.vue';
import GlobalDrawer from '@/components/ui/GlobalDrawer.vue';
import RewardPoints from '@/components/RewardPoints.vue';

// Get user ID from auth store or local storage
const userId = 'user123'; // Replace with actual user ID from your auth system

const referralStore = useReferralStore();
const pointsStore = usePointsStore();
const showDrawer = ref(false);

const stats = [
  {
    title: 'Total Referral',
    value: 20,
    icon: 'IconShare2',
  },
  {
    title: 'Total Success',
    value: 16,
    icon: 'IconCheck',

  },
  {
    title: 'Total Pending',
    value: 4,
    icon: 'IconClock',

  },
  {
    title: 'Total Rejected',
    value: 0,
    icon: 'IconX',
  }
];

const points = ref(200);

onMounted(() => {
  referralStore.fetchReferrals();
  pointsStore.fetchPoints();
});

const handleFormSubmit = async (formData: any) => {
  const result = await referralStore.addReferral(formData);
  if (result.success) {
    showDrawer.value = false;
  }
};

const handleUpgrade = () => {
  // Handle upgrade logic here
  console.log('Upgrade button clicked');
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <div class="">
      <CopyReferralLink
        :referral-code="userId"
        @new-connection="showDrawer = true"
      />
    </div>
    <RewardPoints 
      :points="points" 
      :stats="stats"
      @upgrade="handleUpgrade"
    />
    <div class="flex flex-col space-y-6 col-span-2">

      <!-- Referral History -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <ReferralHistoryTable 
          :referrals="referralStore.paginatedReferrals"
          :loading="referralStore.loading"
          :error="referralStore.error"
          :total-items="referralStore.totalItems"
          :current-page="referralStore.currentPage"
          :items-per-page="referralStore.itemsPerPage"
          :status-filter="referralStore.statusFilter"
          @page-change="referralStore.setPage"
          @status-filter-change="referralStore.setStatusFilter"
          @search="referralStore.setSearchQuery"
        />
      </div>
    </div> 

    <!-- Add Referral Drawer -->
    <GlobalDrawer v-model="showDrawer" title="New Connection Referred" size="md" >
      <ReferralForm 
        :loading="referralStore.loading" 
        :error="referralStore.error"
        @submit="handleFormSubmit" 
      />
    </GlobalDrawer>
  </div>
</template>

