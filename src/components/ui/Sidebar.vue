<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { navGroups, HomeIcon, OfferIcon, PackageIcon, PaymentIcon, ShareIcon, ProfileIcon, ReportIcon, BellIcon } from '@/config/navigation';

const iconMap = {
  'HomeIcon': HomeIcon,
  'OfferIcon': OfferIcon,
  'PackageIcon': PackageIcon,
  'PaymentIcon': PaymentIcon,
  'ShareIcon': ShareIcon,
  'ProfileIcon': ProfileIcon,
  'ReportIcon': ReportIcon,
  'BellIcon': BellIcon,
} as const;

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap];
};

const props = defineProps({
  isMobileMenuOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggleMobileMenu']);
const { theme, setTheme } = useTheme();
const isCollapsed = ref(false);

const handleMobileMenuToggle = () => {
  emit('toggleMobileMenu');
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};


const groupTitles: { [key: string]: string } = {
  main: 'Main',
  activity: 'Activity',
  others: 'Others'
};
</script>

<template>
  <div 
    class="bg-[url('/images/gradient.svg')] bg-cover bg-center p-4 relative overflow-hidden will-change-transform flex flex-col justify-between"
    :class="{
      'w-17': isCollapsed,
      'w-[240px]': !isCollapsed,
      'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]': true
    }"
    :style="{
      '--tw-translate-x': isCollapsed ? '-10px' : '0',
      'transition-property': 'width, transform',
      'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'transition-duration': '300ms'
    }"
  >
  <div class="">
    <div class="flex items-center justify-between h-16">
      <Transition name="fade" mode="out-in">
        <img 
          v-if="!isCollapsed" 
          src="/logo.svg" 
          alt="Logo" 
          class="h-[27px] w-auto"
          key="logo-expanded"
        />
      </Transition>
      <div class="flex items-center">
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <IconPanelRightOpen 
            v-if="isCollapsed" 
            class="h-5 w-5 text-gray-500 dark:text-gray-300 icon-transition transform hover:scale-110"
          />
          <IconPanelRightClose 
            v-else 
            class="h-5 w-5 text-gray-500 dark:text-gray-300 icon-transition transform hover:scale-110"
          />
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-0">
      <nav class="space-y-4">
        <div v-for="navGroup in navGroups" :key="navGroup.group" class="space-y-2">
          <Transition name="fade" mode="out-in">
            <p 
              v-if="!isCollapsed"
              class="font-light text-gray-700 dark:text-gray-200"
              key="title-expanded"
            >
              {{ groupTitles[navGroup.group] || navGroup.group }}
          </p>
          </Transition>
          <ul class="space-y-1">
            <li v-for="item in navGroup.items" :key="item.path">
              <router-link
                :to="item.path"
                class="flex items-center text-sm rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-200 group p-2"
                :class="[
                  {
                    'bg-gradient-to-r from-[#143A7A] to-[#0F172A] text-white': $route.path === item.path,
                    'hover:bg-gradient-to-r hover:from-[#143A7A]/90 hover:to-[#0F172A]/90 hover:text-white': $route.path !== item.path,
                  }
                ]"
                @click="handleMobileMenuToggle"
              >
                <span class="flex-shrink-0 flex items-center justify-center transition-colors" :class="{
                  'text-white': $route.path === item.path || $route.path.startsWith(item.path + '/'),
                  'text-gray-500 dark:text-gray-400 group-hover:text-white': $route.path !== item.path && !$route.path.startsWith(item.path + '/')
                }">
                  <component :is="getIconComponent(item.icon)" class="h-5 w-5" />
                </span>
                <Transition name="fade" mode="out-in">
                  <span 
                    v-if="!isCollapsed" 
                    class="ml-3 whitespace-nowrap overflow-hidden text-ellipsis text-base"
                    :class="{
                      'text-white': $route.path === item.path || $route.path.startsWith(item.path + '/'),
                      'text-gray-700 dark:text-gray-200 group-hover:text-white': $route.path !== item.path && !$route.path.startsWith(item.path + '/')
                    }"
                    key="text-expanded"
                  >
                    {{ item.name }}
                  </span>
                </Transition>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>

    <div v-if="!isCollapsed">
      <div class="rounded-xl p-2 px-6 bg-blue-950">
        <p class="text-white font-semibold">Enterprise</p>
        <p class="text-xs text-blue-500">Next billing on May 1, 2025</p>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <button 
          @click="setTheme('light')"
          class="w-full flex items-center justify-center px-2 py-1.5 text-sm rounded-lg transition-colors duration-200 disabled:opacity-50"
          :class="theme === 'light' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
          aria-label="Switch to light mode"
        >
          <div v-if="theme === 'light'" class="w-1.5 h-1.5 rounded bg-blue-400 mr-2" />
          <span>Light</span>
        </button>
        <button 
          @click="setTheme('dark')"
          class="w-full flex items-center justify-center px-2 py-1.5 text-sm rounded-lg transition-colors duration-200 disabled:opacity-50"
          :class="theme === 'dark' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
        >
          <div v-if="theme === 'dark'" class="w-1.5 h-1.5 rounded bg-blue-400 mr-2" />
          <span>Dark</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade transition with delay for smoother chaining */
.fade-enter-active {
  transition: opacity 0.25s ease-out 0.1s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.fade-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

/* Smooth hover effects */
button {
  transition: background-color 0.15s ease, transform 0.15s ease;
}

button:active {
  transform: scale(0.95);
}

/* Menu item transitions */
.menu-item {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Smooth width transition */
.sidebar-transition {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width;
}

/* Icon transitions */
.icon-transition {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth background transitions */
.bg-transition {
  transition: background-color 0.2s ease;
}
</style>