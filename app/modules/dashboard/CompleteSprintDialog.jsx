'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

export default function CompleteSprintDialog({ sprintName, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
        >
          <div className="relative border-b border-[#E5E7EB] p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#94A3B8] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-bold text-[#0F172A]">Complete Sprint?</h2>
          </div>

          <div className="p-6">
            <div className="mb-6 space-y-3">
              <p className="text-sm leading-relaxed text-[#475569]">
                You&apos;re about to complete
              </p>
              <div className="rounded-lg bg-[#F8FAFC] px-3 py-2 border border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#0F172A]">{sprintName}</p>
              </div>
              <p className="text-sm leading-relaxed text-[#475569]">
                All tasks assigned to this sprint will be archived. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg border-2 border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#475569] transition-all hover:border-[#0F172A] hover:text-[#0F172A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0F172A]/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Completing...' : 'Complete'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
