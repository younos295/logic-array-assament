<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import BottomNavigationMobile from './components/ui/BottomNavigationMobile.vue';
import TopBarMobile from './components/ui/TopBarMobile.vue';
import Sidebar from './components/ui/Sidebar.vue';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = (state?: boolean) => {
  if (state !== undefined) {
    isMobileMenuOpen.value = state;
  } else {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
};

const handleClickOutside = (event: MouseEvent) => {
  const sidebar = document.querySelector('.sidebar');
  const menuButton = document.querySelector('.menu-button');
  
  if (isMobileMenuOpen.value && 
      !sidebar?.contains(event.target as Node) && 
      !menuButton?.contains(event.target as Node)) {
    toggleMobileMenu(false);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    toggleMobileMenu(false);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

const pageTitle = computed(() => {
  return route.meta?.title || 'Dashboard';
});
</script>

<template>
  <div class="min-h-screen w-full bg-background-light dark:bg-background-dark text-text-primary transition-colors duration-200 flex flex-col md:flex-row">
    <div class="hidden md:block fixed left-0 top-0 bottom-0 w-64 z-30 overflow-hidden">
      <Sidebar
        class="h-full w-full overflow-y-auto"
        :is-mobile-menu-open="isMobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
      />
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-20 md:hidden"
      @click="toggleMobileMenu(false)"
    ></div>

    <!-- Mobile Sidebar -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-y-0 left-0 w-64 z-30 md:hidden"
    >
      <Sidebar
        class="h-full w-full overflow-y-auto"
        :is-mobile-menu-open="isMobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
      />
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-h-screen md:ml-64">
      <TopBarMobile class="md:hidden flex-shrink-0" />

      <!-- Scrollable section -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-card-light dark:bg-card-dark md:rounded-tl-2xl">
        <div class="container mx-auto my-16 md:my-0">
          <RouterView />
        </div>
      </main>

      <BottomNavigationMobile class="md:hidden flex-shrink-0" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
