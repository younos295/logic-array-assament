
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import HomeIcon from '@/assets/icons/home-01.svg'
import PaymentIcon from '@/assets/icons/payment-02.svg'
import ShareIcon from '@/assets/icons/share-01.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import MobileNavBg from '@/assets/images/mobile-nav-bg.svg';

const route = useRoute()

const navItems = [
  { 
    name: 'Home', 
    icon: HomeIcon, 
    path: '/',
    active: computed(() => route.path === '/')
  },
  { 
    name: 'Payment', 
    icon: PaymentIcon, 
    path: '/payment',
    active: computed(() => route.path.startsWith('/payment'))
  },
  { 
    name: 'Referral', 
    icon: ShareIcon, 
    path: '/referral',
    active: computed(() => route.path.startsWith('/referral'))
  },
  { 
    name: 'Profile', 
    icon: ProfileIcon, 
    path: '/profile',
    active: computed(() => route.path.startsWith('/profile'))
  }
]

const leftNavItems = computed(() => navItems.slice(0, 2))
const rightNavItems = computed(() => navItems.slice(2))
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between p-6"
  >
    <component 
      :is="MobileNavBg" 
      class="absolute inset-0 z-0 pointer-events-none text-card-light dark:text-card-dark w-full h-full" 
      aria-hidden="true"
    />

    <div class="relative z-10 flex items-center justify-between w-full">
      <div class="flex space-x-8">
        <router-link
          v-for="item in leftNavItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center group"
          :class="{ 'opacity-70': !item.active.value }"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 transition-colors"
            :class="item.active.value
              ? 'text-brand-light'
              : 'text-tertiary-light group-hover:text-brand-light'"
          />
          <span
            class="text-xs mt-1 transition-colors"
            :class="item.active.value
              ? 'text-brand-light font-medium'
              : 'text-tertiary-light group-hover:text-brand-light'"
          >
            {{ item.name }}
          </span>
        </router-link>
      </div>

      <div class="flex space-x-8">
        <router-link
          v-for="item in rightNavItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center group"
          :class="{ 'opacity-70': !item.active.value }"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 transition-colors"
            :class="item.active.value
              ? 'text-brand-light'
              : 'text-tertiary-light group-hover:text-brand-light'"
          />
          <span
            class="text-xs mt-1 transition-colors"
            :class="item.active.value
              ? 'text-brand-light font-medium'
              : 'text-tertiary-light group-hover:text-brand-light'"
          >
            {{ item.name }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>