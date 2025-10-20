/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

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
