// 全站共享的登录/注册弹窗状态：任何组件一行代码即可唤起
export type AuthModalMode = 'login' | 'register'

export const useAuthModal = () => {
  const isOpen = useState('auth-modal-open', () => false)
  const mode = useState<AuthModalMode>('auth-modal-mode', () => 'login')

  const open = (next: AuthModalMode = 'login') => {
    mode.value = next
    isOpen.value = true
  }

  const openLogin = () => open('login')
  const openRegister = () => open('register')
  const close = () => {
    isOpen.value = false
  }

  return { isOpen, mode, open, openLogin, openRegister, close }
}
