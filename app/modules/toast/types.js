/**
 * @typedef {'default' | 'success' | 'error' | 'warning' | 'info'} ToastType
 *
 * @typedef {{ id: string, type: ToastType, title?: string, message: string, duration?: number }} ToastData
 *
 * @typedef {{ toasts: ToastData[], addToast: (toast: Omit<ToastData, 'id'>) => string, removeToast: (id: string) => void, clearToasts: () => void }} ToastContextValue
 *
 * @typedef {{ position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' }} ToasterProps
 */
