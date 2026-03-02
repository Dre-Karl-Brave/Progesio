'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function AddMemberModal({ onClose, onAdd }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await onAdd(email.trim())
      onClose()
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {DASHBOARD_DATA.members.addButton}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#475569] transition-colors hover:text-[#0F172A]"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="member@example.com"
              required
              autoFocus
            />
            {error && (
              <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#E5E7EB] px-4 py-2 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
