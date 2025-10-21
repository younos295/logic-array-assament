import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api.service';

export const usePointsStore = defineStore('points', () => {
  const currentPoints = ref(0);
  const lifetimePoints = ref(0);
  const loading = ref(false);
  const error = ref(null as string | null);

  async function fetchPoints() {
    try {
      loading.value = true;
      error.value = null;
      const data = await api.getPoints();
      currentPoints.value = data.current;
      lifetimePoints.value = data.lifetime;
    } catch (err) {
      error.value = 'Failed to fetch points balance';
      console.error('Error fetching points:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    currentPoints,
    lifetimePoints,
    loading,
    error,
    fetchPoints,
  };
});
