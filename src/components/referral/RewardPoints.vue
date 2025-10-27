<template>
  <div class="grid grid-cols-2 gap-2 md:gap-5">
    <div class="col-span-2 bg-[url('/images/gradient.svg')] bg-cover p-4 md:p-6 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center gap-2 md:gap-4">
      <h3 class="text-5xl">🏆</h3>
      <div class="flex flex-col flex-1">
        <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium">Reward Point</p>
        <div class="flex justify-between items-center">
          <p class="text-2xl md:text-3xl text-gray-700 dark:text-gray-100">
            {{ points }} <span class="text-xl md:text-2xl text-gray-400">৳ {{ points * 10 }}</span>
          </p>
          <button 
            @click="$emit('upgrade')" 
            class="rounded px-4 py-2 text-sm md:text-base text-white bg-blue-600 hover:bg-blue-700 transition-colors hidden md:block"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>

    <div 
      v-for="stat in stats" 
      :key="stat.title"
      class="bg-[url('/images/gradient.svg')] bg-cover p-2 md:p-4 border border-gray-300 dark:border-gray-600 rounded-xl flex gap-2 md:gap-4 items-center"
    >
      <div 
        class="flex justify-center items-center h-8 md:h-10 w-8 md:w-10 rounded-full bg-blue-200 dark:bg-blue-500"
      >
        <component 
          :is="stat.icon"
          class="text-blue-800 dark:text-blue-100 size-4 md:size-5" 
        />
      </div>
      <div class="flex flex-col flex-1">
        <p class="text-gray-700 dark:text-gray-200 font-medium">{{ stat.title }}</p>
        <p class="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-100">{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineProps({
  points: {
    type: Number,
    required: true
  },
  stats: {
    type: Array as () => Array<{
      title: string;
      value: string | number;
      icon: any;
    }>,
    required: true
  }
});

defineEmits(['upgrade']);
</script>
