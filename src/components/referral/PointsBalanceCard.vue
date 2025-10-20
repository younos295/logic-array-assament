<script setup lang="ts">
defineProps<{
  currentPoints: number;
  lifetimePoints: number;
  loading?: boolean;
  error?: string | null;
}>();
</script>

<template>
  <div class="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-xl shadow-lg overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-100 dark:text-blue-200">Current Points</p>
          <div v-if="loading" class="h-8 w-24 bg-blue-400 dark:bg-blue-600 rounded animate-pulse mt-1"></div>
          <p v-else class="text-3xl font-bold text-white">{{ currentPoints.toLocaleString() }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-blue-100 dark:text-blue-200">Lifetime Points</p>
          <p class="text-lg font-semibold text-blue-100 dark:text-blue-200">{{ lifetimePoints.toLocaleString() }}</p>
        </div>
      </div>
      
      <div v-if="error" class="mt-4 p-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
        {{ error }}
      </div>
      
      <div class="mt-4 pt-4 border-t border-blue-400/30">
        <div class="flex items-center">
          <div class="flex-shrink-0 text-blue-200 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="ml-2 text-sm text-blue-100 dark:text-blue-200">
            Earn 100 points for each successful referral
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
