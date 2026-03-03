'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { Snackbar, Alert } from '@mui/material'
import { Input } from '@/components/ui/input'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function AddMemberModal({ onClose, onAdd }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await onAdd(email.trim())
      setShowSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong'
      setErrorMessage(message)
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSuccess = (_event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowSuccess(false)
  }

  const handleCloseError = (_event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowError(false)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className='w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-[#0F172A]'>{DASHBOARD_DATA.members.addButton}</h2>
          <button
            onClick={onClose}
            className='rounded p-1 text-[#475569] transition-colors hover:text-[#0F172A] hover:cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-medium text-[#0F172A]'>Email address</label>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='member@example.com'
              required
              autoFocus
            />
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md border border-[#E5E7EB] px-4 py-2 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || !email.trim()}
              className='rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50'
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSuccess} severity='success' sx={{ width: '100%' }}>
            Member added successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseError} severity='error' sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </div>
  )
}
