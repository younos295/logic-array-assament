import { createApp } from 'vue'
import * as lucideIcons from 'lucide-vue-next'

export default {
  install(app: ReturnType<typeof createApp>) {
    // Register all Lucide icons globally
    Object.entries(lucideIcons).forEach(([name, icon]) => {
      if (name !== 'default' && name && name[0] === name[0]?.toUpperCase() && typeof icon === 'function') {
        app.component(`Icon${name}`, icon as any);
      }
    })
  }
}
