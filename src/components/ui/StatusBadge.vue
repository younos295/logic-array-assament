<template>
  <span :class="[baseClasses, statusConfig.classes]">
    {{ statusConfig.text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type StatusType = 'pending' | 'success' | 'rejected' | 'default';

interface StatusConfig {
  text: string;
  classes: string;
}

interface Props {
  status: StatusType;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'default',
});

const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

const statusConfig = computed((): StatusConfig => {
  const configs: Record<StatusType, StatusConfig> = {
    pending: {
      classes: 'bg-yellow-50 border border-yellow-600 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200',
      text: 'Pending'
    },
    success: {
      classes: 'bg-green-50 border border-green-600 text-green-600 dark:bg-green-900 dark:text-green-200',
      text: 'Success'
    },
    rejected: {
      classes: 'bg-red-50 border border-red-400 text-red-600 dark:bg-red-900 dark:text-red-200',
      text: 'Rejected'
    },
    default: {
      classes: 'bg-gray-50 border border-gray-400 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
      text: 'Unknown'
    }
  };

  return configs[props.status] || configs.default;
});
</script>
