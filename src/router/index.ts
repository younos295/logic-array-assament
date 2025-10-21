import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/referral',
    name: 'referral',
    component: () => import('@/views/ReferralView.vue'),
    meta: {
      title: 'Referral Program',
      requiresAuth: true
    }
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/views/PaymentView.vue'),
    meta: {
      title: 'Payment',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'My Profile',
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
