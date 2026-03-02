'use client'
import { Close } from '@mui/icons-material'
import { Alert, AlertTitle, Box, IconButton } from '@mui/material'
import { themeV2 } from '../theme/themeV2'
import { useEffect, useState } from 'react'

export const Toast = ({ toast, onClose }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 300)
  }

  const getSeverity = () => {
    switch (toast.type) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'info'
    }
  }

  return (
    <Box
      sx={{
        boxShadow: themeV2.shadows[2],
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        opacity: show ? 1 : 0,
        maxWidth: '420px',
        mb: 1
      }}
    >
      <Alert
        severity={getSeverity()}
        sx={{
          width: '100%',
          '& .MuiAlert-icon': { fontSize: '1.25rem' },
          '&.MuiAlert-standardSuccess': {
            backgroundColor: themeV2.palette.states.success.background,
            color: themeV2.palette.states.success.primary
          },
          '&.MuiAlert-standardError': {
            backgroundColor: themeV2.palette.states.error.background,
            color: themeV2.palette.states.error.primary
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: themeV2.palette.states.warning.background,
            color: themeV2.palette.states.warning.main
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: themeV2.palette.states.info.background,
            color: themeV2.palette.states.info.primary
          }
        }}
        action={
          <IconButton sx={{ p: 1, mt: -0.5 }} size='small' aria-label='close' color='inherit' onClick={handleClose}>
            <Close fontSize='small' />
          </IconButton>
        }
      >
        {toast.title && <AlertTitle sx={{ fontWeight: 'bold' }}>{toast.title}</AlertTitle>}
        <Box sx={{ whiteSpace: 'pre-line' }}>{toast.message}</Box>
      </Alert>
    </Box>
  )
}
