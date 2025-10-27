// vue-shims.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue' {
  export * from '@vue/runtime-dom';
  export const ref: any;
  export const reactive: any;
  export const computed: any;
  export const watch: any;
  export const watchEffect: any;
  export const onMounted: any;
  export const onUnmounted: any;
  export const onUpdated: any;
  export const defineComponent: any;
  export const createApp: any;
  
  export const nextTick: any;
  export const toRef: any;
  export const toRefs: any;
  export const isRef: any;
  export const isReactive: any;
  export const isReadonly: any;
  export const isProxy: any;
  
  export default {
    install: (app: any) => {}
  };
}
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
