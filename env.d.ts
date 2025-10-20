/// <reference types="vite/client" />

// Vue SFC modules
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// For SVG imports
declare module '*.svg' {
  import type { DefineComponent } from 'vue';
  const content: DefineComponent<{}, {}, any>;
  export default content;
}

// For image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// For Vue's global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      formatDate: (value: string) => string;
    };
  }
}

export {};
