import { ref, watchEffect, onMounted } from 'vue'

type Theme = 'light' | 'dark' | 'system';
const theme = ref('light' as Theme)

// Check for saved theme preference or use system preference
const getSystemTheme = (): Theme => {
  if (typeof localStorage !== 'undefined' && localStorage.theme) {
    return localStorage.theme as Theme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    if (newTheme === 'system') {
      localStorage.removeItem('theme')
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', systemTheme === 'dark')
    } else {
      localStorage.theme = newTheme
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }

  // Initialize theme on component mount
  onMounted(() => {
    const savedTheme = localStorage.theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
      theme.value = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      theme.value = 'light'
    }
  })

  // Watch for system theme changes when 'system' is selected
  watchEffect(() => {
    if (localStorage.theme === 'system' || !('theme' in localStorage)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', systemTheme === 'dark')
        theme.value = systemTheme
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  })

  return { 
    theme, 
    setTheme,
    systemTheme: getSystemTheme
  }
}
