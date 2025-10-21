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

<!-- Test comment: File permissions are working correctly! -->
 <!-- bg-background-light -->
<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark text-text-primary transition-colors duration-200 flex">
    <!-- Mobile overlay -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-20 md:hidden"
      @click="toggleMobileMenu(false)"
    ></div>
    
    <!-- Sidebar -->
    <Sidebar
      class="sidebar hidden md:block min-h-screen fixed md:relative z-30 transform transition-transform duration-300 ease-in-out"
      :class="{
        'translate-x-0': isMobileMenuOpen,
        '-translate-x-full': !isMobileMenuOpen,
        'md:translate-x-0': true
      }"
      :is-mobile-menu-open="isMobileMenuOpen" 
      @toggle-mobile-menu="toggleMobileMenu" 
    />
    <TopBarMobile class="md:hidden" />
    <div class="m-0 mt-20 md:m-6 p-2 md:p-6 flex-1 rounded-2xl container mx-auto bg-card-light dark:bg-card-dark">
      <RouterView />
    </div>
    <BottomNavigationMobile class="md:hidden" />
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
