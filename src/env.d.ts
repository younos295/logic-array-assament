/// <reference types="vite/client" />

// Vue SFC module declarations
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Environment variables
declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue global properties
declare module 'vue' {
  interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | any
    }
  }
}

export {}
