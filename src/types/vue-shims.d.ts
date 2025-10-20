// Local shim to re-export runtime types so `import { ref } from 'vue'` works
// This avoids issues where the compiler resolves a different module shape.
export * from '@vue/runtime-dom'
export { default } from '@vue/runtime-dom'

declare module 'vue' {
  export * from '@vue/runtime-dom'
  const _default: typeof import('@vue/runtime-dom')['default']
  export default _default
}

export {}
