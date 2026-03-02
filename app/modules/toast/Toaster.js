import { Box } from '@mui/material'
import { useToasts } from './context'
import { Toast } from './Toast'

export const Toaster = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToasts()

  const positionStyles = {
    'top-left': { top: 20, left: 20, alignItems: 'flex-start' },
    'top-right': { top: 20, right: 20, alignItems: 'flex-end' },
    'bottom-left': { bottom: 20, left: 20, alignItems: 'flex-start' },
    'bottom-right': { bottom: 20, right: 20, alignItems: 'flex-end' },
    'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
    'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        ...positionStyles[position]
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </Box>
  )
}
