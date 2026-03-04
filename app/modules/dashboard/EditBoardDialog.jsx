'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

export default function EditBoardDialog({ board, onClose, onUpdated }) {
  const [name, setName] = useState(board.name)
  const [description, setDescription] = useState(board.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Board name is required')
      return
    }

    setLoading(true)

    try {
      const res = await axios.patch(`/api/boards/${board.id}`, {
        name,
        description,
      })
      onUpdated(res.data.board)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update board')
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
          className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        >
          <div className="relative border-b border-[#E5E7EB] p-6 pb-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#94A3B8] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-bold text-[#0F172A]">Edit Board</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6 space-y-4">
              {/* Board Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]">
                  Board Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Project Alpha"
                  disabled={loading}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Board Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#0F172A]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your board"
                  rows={3}
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
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
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0F172A]/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
