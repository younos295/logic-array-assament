import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import lucide from './plugins/lucide';

// Create the Vue app
const app = createApp(App);

// Initialize Pinia
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(lucide);

// Add global error handler
app.config.errorHandler = (err: unknown, vm: unknown, info: string) => {
  console.error('Vue error:', { err, vm, info });
  // You can add error tracking here (e.g., Sentry, LogRocket)
};

// Add global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      formatDate: (value: string) => string;
    };
  }
}

app.config.globalProperties.$filters = {
  formatDate(value: string) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Mount the app
app.mount('#app');
