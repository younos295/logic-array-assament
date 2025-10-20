<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useReferralStore } from '@/stores/referral.store';
import { usePointsStore } from '@/stores/points.store';
import PointsBalanceCard from '@/components/referral/PointsBalanceCard.vue';
import CopyReferralLink from '@/components/referral/CopyReferralLink.vue';
import ReferralForm from '@/components/referral/ReferralForm.vue';
import GlobalDrawer from '@/components/ui/GlobalDrawer.vue';
import RewardPoints from '@/components/RewardPoints.vue';

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
    iconClass: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/50'
  },
  {
    title: 'Total Pending',
    value: 4,
    icon: 'IconClock',
    iconClass: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/50'
  },
  {
    title: 'Total Rejected',
    value: 0,
    icon: 'IconX',
    iconClass: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/50'
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
      @new-connection="showDrawer = true"
      />
    </div>
    <RewardPoints 
      :points="points" 
      :stats="stats"
      @upgrade="handleUpgrade"
    />
    <div class="flex flex-col space-y-6">

      <!-- Points Balance Card -->
      <PointsBalanceCard 
        :current-points="pointsStore.currentPoints" 
        :lifetime-points="pointsStore.lifetimePoints" 
        :loading="pointsStore.loading" 
        :error="pointsStore.error"
      />

      <!-- Referral History -->
      <!-- <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
      </div> -->
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
