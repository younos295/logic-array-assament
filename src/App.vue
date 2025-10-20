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
    <div class="m-0 md:m-6 p-2 md:p-6 flex-1 rounded-2xl container mx-auto bg-card-light dark:bg-card-dark">
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

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
