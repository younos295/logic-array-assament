import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Referral, ReferralStatus, ReferralFormData } from '@/types/referral';
import api from '@/services/api.service';

export const useReferralStore = defineStore('referral', () => {
  const referrals = ref([] as Referral[]);
  const loading = ref(false);
  const error = ref(null as string | null);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const searchQuery = ref('');
  const statusFilter = ref('all' as ReferralStatus | 'all');

  const filteredReferrals = computed(() => {
    return (referrals.value || []).filter((referral: Referral) => {
      const matchesSearch = referral.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          referral.name?.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesStatus = statusFilter.value === 'all' || referral.status === statusFilter.value;
      return matchesSearch && matchesStatus;
    });
  });

  const paginatedReferrals = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredReferrals.value.slice(start, end);
  });

  async function fetchReferrals() {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.getMyHistory();
      referrals.value = response.data || [];
      totalItems.value = response.total || 0;
    } catch (err) {
      error.value = 'Failed to fetch referrals';
      console.error('Error fetching referrals:', err);
    } finally {
      loading.value = false;
    }
  }

  async function addReferral(referralData: ReferralFormData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.createReferral(referralData);
      await fetchReferrals(); // Refresh the list
      return response;
    } catch (err) {
      error.value = 'Failed to add referral';
      console.error('Error adding referral:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setPage(page: number) {
    currentPage.value = page;
  }

  function setStatusFilter(status: ReferralStatus | 'all') {
    statusFilter.value = status;
    currentPage.value = 1; // Reset to first page when filter changes
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
    currentPage.value = 1; // Reset to first page when search changes
  }

  return {
    // State
    referrals,
    loading,
    error,
    totalItems,
    currentPage,
    itemsPerPage,
    searchQuery,
    statusFilter,
    
    // Getters
    filteredReferrals,
    paginatedReferrals,
    
    // Actions
    fetchReferrals,
    addReferral,
    setPage,
    setStatusFilter,
    setSearchQuery,
  };
});
