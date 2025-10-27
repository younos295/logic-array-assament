<template>
  <div class="flex justify-between items-center">
    <div class="relative rounded-md shadow-sm max-w-xs w-full mb-4 sm:mb-0">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch class="h-4 w-4 text-gray-400" size="16" />
      </div>
      <input type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :placeholder="placeholder" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="flex gap-4 items-center">
      <div class="flex gap-2 p-2 px-3 rounded-lg bg-background-light dark:bg-background-dark">
        <IconMessageCircleMore class="text-gray-400 size-5" />
        <div class="relative">
          <IconBell class="text-gray-400 size-5" />
          <span
            class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </div>
      </div>
      <!-- avatar -->
      <div class="flex items-center gap-2 p-1 px-3 rounded-lg bg-background-light dark:bg-background-dark">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="" class="w-7 h-7 rounded-full" />
          </div>
          <IconChevronDown class="text-gray-400 size-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  modelValue: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  modelValue: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
