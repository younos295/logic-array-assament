<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue';
import { useVModel } from '@vueuse/core';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
type Side = 'right' | 'left' | 'top' | 'bottom';

interface Props {
  modelValue: boolean;
  title?: string;
  size?: Size;
  side?: Side;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  fullHeight?: boolean;
  noPadding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  side: 'right',
  closeOnClickOutside: true,
  closeOnEscape: true,
  showCloseButton: true,
  fullHeight: false,
  noPadding: false,
});

defineOptions({
  inheritAttrs: false,
});


const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'open'): void;
}>();

const isOpen = useVModel(props, 'modelValue', emit);
const drawerRef = ref<HTMLElement | null>(null);

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const sideClasses = {
  right: 'inset-y-0 right-0',
  left: 'inset-y-0 left-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
};

const contentClasses = computed(() => {
  const classes = [];
  
  if (props.side === 'right' || props.side === 'left') {
    classes.push('h-full', 'w-full', sizeClasses[props.size]);
    if (props.fullHeight) classes.push('h-screen');
  } else {
    classes.push('w-full', 'h-auto', 'max-h-[90vh]');
    if (props.fullHeight) classes.push('h-screen');
  }
  
  if (props.side === 'right') classes.push('ml-auto');
  if (props.side === 'bottom') classes.push('mt-auto');
  
  return classes.join(' ');
});

function close() {
  isOpen.value = false;
  emit('close');
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEscape) {
    close();
  }
}

function handleClickOutside(e: MouseEvent) {
  if (props.closeOnClickOutside && drawerRef.value && !drawerRef.value.contains(e.target as Node)) {
    close();
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);
    emit('open');
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('mousedown', handleClickOutside);n});
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity ease-in-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        :class="{ 'bg-black/50 dark:bg-white/50': isOpen }"
        @click.self="close"
      >
        <transition
          :enter-active-class="`transition-transform ease-in-out duration-200 ${side === 'right' ? 'translate-x-full' : side === 'left' ? '-translate-x-full' : side === 'top' ? '-translate-y-full' : 'translate-y-full'}`"
          enter-to-class="translate-x-0 translate-y-0"
          leave-active-class="transition-transform ease-in-out duration-200"
          leave-from-class="translate-x-0 translate-y-0"
          :leave-to-class="`${side === 'right' ? 'translate-x-full' : side === 'left' ? '-translate-x-full' : side === 'top' ? '-translate-y-full' : 'translate-y-full'}`"
        >
          <div
            ref="drawerRef"
            class="fixed shadow-xl flex flex-col overflow-hidden bg-cover bg-center bg-card-light dark:bg-card-dark"
            :class="[
              sideClasses[side],
              contentClasses,
              'bg-[url(\'/images/gradient.svg\')]'
            ]"
            role="dialog"
            aria-modal="true"
            :aria-label="title || 'Drawer'"
          >
            <div class="relative flex flex-col h-full" :class="{ 'p-6': !noPadding }">
            <div v-if="title || $slots.header || showCloseButton" class="flex items-center justify-between mb-6">
              <h2 v-if="title" class="text-xl font-medium text-gray-900 dark:text-white">
                {{ title }}
              </h2>
              <slot name="header" />
              
              <button
                v-if="showCloseButton"
                type="button"
                class="p-1.5 rounded-full text-red-500 bg-red-900/20 hover:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                @click="close"
                aria-label="Close panel"
              >
                <span class="sr-only">Close panel</span>
                <IconX class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="mt-6">
              <slot name="footer" />
            </div>
            </div> <!-- End Content Wrapper -->
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>
