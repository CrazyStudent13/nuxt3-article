// 全站主题偏好：浅色 / 深色 / 跟随系统
// 偏好存 localStorage；html.dark 类由这里与 nuxt.config 的防闪烁内联脚本共同驱动
export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_KEY = 'theme'

// 系统主题监听只挂一次：init 可能被插件与页面重复调用，避免监听器叠加
let systemListenerBound = false

export const useTheme = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')
  const systemDark = useState<boolean>('theme-system-dark', () => false)

  const isDark = computed(() => mode.value === 'dark' || (mode.value === 'system' && systemDark.value))

  // 把当前解析结果落到 html 根元素上
  const apply = () => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  // 客户端初始化：读取偏好、监听系统主题变化（幂等，可多处调用）
  const init = () => {
    if (!import.meta.client) {
      return
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const saved = (localStorage.getItem(THEME_KEY) as ThemeMode | null) || 'light'
    mode.value = saved
    systemDark.value = media.matches
    apply()

    // 跟随系统模式下实时响应系统切换
    if (!systemListenerBound) {
      systemListenerBound = true
      media.addEventListener('change', (event) => {
        systemDark.value = event.matches
        apply()
      })
    }
  }

  const setMode = (next: ThemeMode) => {
    mode.value = next
    localStorage.setItem(THEME_KEY, next)
    apply()
  }

  return { mode, isDark, init, setMode }
}
