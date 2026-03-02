let addToastFn = null
let removeToastFn = null
let clearToastsFn = null

export const setToastHandler = (handler) => {
  addToastFn = handler
}
export const setDismissHandler = (handler) => {
  removeToastFn = handler
}
export const setClearHandler = (handler) => {
  clearToastsFn = handler
}

const createToast = (message, options) => {
  if (!addToastFn) {
    console.warn('Toast handler not set. Make sure to render the Toaster component.')
    return ''
  }
  return addToastFn({ type: 'default', message, ...options })
}

export const toast = Object.assign((message, options) => createToast(message, options), {
  success: (message, options) => createToast(message, { ...options, type: 'success' }),
  error: (message, options) => createToast(message, { ...options, type: 'error' }),
  warning: (message, options) => createToast(message, { ...options, type: 'warning' }),
  info: (message, options) => createToast(message, { ...options, type: 'info' }),
  dismiss: (toastId) => {
    if (!removeToastFn) {
      console.warn('Dismiss handler not set. Make sure to render the Toaster component.')
      return
    }
    if (toastId) {
      removeToastFn(toastId)
    } else if (clearToastsFn) {
      clearToastsFn()
    }
  }
})
