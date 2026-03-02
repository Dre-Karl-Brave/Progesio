'use client'
import { createContext, useCallback, useContext, useState } from 'react'

const generateId = () => Math.random().toString(36).substring(2, 9)

const ToastContext = createContext(undefined)

export const useToasts = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToasts must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast) => {
      const id = generateId()
      setToasts((prev) => [...prev, { ...toast, id }])

      if (toast.duration !== 0) {
        const duration = toast.duration || 5000
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast]
  )

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>{children}</ToastContext.Provider>
  )
}
