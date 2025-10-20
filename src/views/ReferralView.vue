<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useReferralStore } from '@/stores/referral.store';
import { usePointsStore } from '@/stores/points.store';
import PointsBalanceCard from '@/components/referral/PointsBalanceCard.vue';
import CopyReferralLink from '@/components/referral/CopyReferralLink.vue';
// import ReferralHistoryTable from '@/components/referral/ReferralHistoryTable.vue';
import ReferralForm from '@/components/referral/ReferralForm.vue';
import GlobalDrawer from '@/components/ui/GlobalDrawer.vue';

const referralStore = useReferralStore();
const pointsStore = usePointsStore();
const showDrawer = ref(false);

const totalValues = reactive([
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
]);

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
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <div class="">
      <CopyReferralLink
      @new-connection="showDrawer = true"
      />
    </div>
    <div class="col-span-1 grid grid-cols-2 gap-2 md:gap-4">
      <div class="col-span-2 bg-[url('/images/gradient.svg')] bg-cover p-4 md:p-6 border border-gray-300 rounded-xl flex gap-2 md:gap-4">
        <h3 class="text-2xl md:text-5xl">🏆</h3>
          <div class="flex flex-col flex-1">
            <p class="text-lg md:text-xl text-gray-700 font-medium">Reword Point</p>
            <div class="flex justify-between">
              <p class="text-2xl md:text-3xl text-gray-700">200 <span class="text-xl md:text-2xl text-gray-400">৳ 2000</span></p>
              <button class="rounded p-2 text-white bg-blue-600">Upgrade</button>
            </div>
          </div>
      </div>
      <div v-for="value in totalValues" :key="value.title" :class="value.icon" class="bg-[url('/images/gradient.svg')] bg-cover p-2 md:p-4 border border-gray-300 rounded-xl flex gap-2 md:gap-4 items-center">
        <div class="bg-blue-100 dark:bg-blue-500 flex justify-center items-center h-10 w-10 rounded-full ">
          <component :is="value.icon" class="text-blue-800 dark:text-blue-100" />
        </div>
          <div class="flex flex-col flex-1">
            <p class="text-gray-700 dark:text-gray-100 font-medium">{{ value.title }}</p>
            <div class="flex justify-between">
              <p class="text-lg md:text-3xl text-gray-700 dark:text-gray-100">{{ value.value }}</p>
            </div>
          </div>
      </div>
    </div>



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
    <GlobalDrawer v-model="showDrawer" title="New Connection Referred" size="sm" >
      <ReferralForm 
        :loading="referralStore.loading" 
        :error="referralStore.error"
        @submit="handleFormSubmit" 
      />
    </GlobalDrawer>
  </div>
</template>
