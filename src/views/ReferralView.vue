<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useReferralStore } from '@/stores/referral.store';
import { usePointsStore } from '@/stores/points.store';
import CopyReferralLink from '@/components/referral/CopyReferralLink.vue';
import ReferralHistoryTable from '@/components/referral/ReferralHistoryTable.vue';
import ReferralForm from '@/components/referral/ReferralForm.vue';
import GlobalDrawer from '@/components/ui/GlobalDrawer.vue';
import RewardPoints from '@/components/referral/RewardPoints.vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import AppBar from '@/components/referral/AppBar.vue';

const userId = 'user123';
const searchQuery = ref('');

const referralStore = useReferralStore();

const handleSearchInput = (value: string) => {
  referralStore.setSearchQuery(value);
};
const pointsStore = usePointsStore();
const showDrawer = ref(false);
type ReferralFormInstance = {
  resetFormState: () => void;
}

const referralFormRef = ref();

const handleDrawerUpdate = (isOpen: boolean) => {
  if (!isOpen && referralFormRef.value) {
    referralFormRef.value.resetFormState();
  }
};

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
  console.log('Upgrade button clicked');
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <div class="md:col-span-2 hidden md:block">
      <AppBar v-model="searchQuery" placeholder="Type a command or search" class="mb-4 sm:mb-0"
        @update:modelValue="handleSearchInput" />
    </div>
    <div class="col-span-1">
      <Tooltip text="Create New Task" placement="top-end">
        <CopyReferralLink :referral-code="userId" @new-connection="showDrawer = true" />
      </Tooltip>
    </div>
    <div class="col-span-1">
      <RewardPoints :points="points" :stats="stats" @upgrade="handleUpgrade" />
    </div>
    <div class="flex flex-col space-y-6 md:col-span-2">
      <div class="overflow-hidden">
        <ReferralHistoryTable :referrals="referralStore.paginatedReferrals" :loading="referralStore.loading"
          :error="referralStore.error" :total-items="referralStore.totalItems" :current-page="referralStore.currentPage"
          :items-per-page="referralStore.itemsPerPage" :status-filter="referralStore.statusFilter"
          @page-change="referralStore.setPage" @status-filter-change="referralStore.setStatusFilter"
          @search="referralStore.setSearchQuery" />
      </div>
    </div>

    <!-- Add Referral Drawer -->
    <GlobalDrawer v-model="showDrawer" title="New Connection Referred" size="md"
      @update:modelValue="handleDrawerUpdate">
      <ReferralForm ref="referralFormRef" :loading="referralStore.loading" :error="referralStore.error"
        @submit="handleFormSubmit" />
    </GlobalDrawer>
  </div>
</template>
