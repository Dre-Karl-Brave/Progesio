'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import CreateSprintDialog from './CreateSprintDialog'
import EditSprintDialog from './EditSprintDialog'
import CompleteSprintDialog from './CompleteSprintDialog'
import axios from 'axios'

export default function SprintSidebar({ isOpen, onClose, boardId, sprints, onSprintCreated, onSprintUpdated, onSprintDeleted, onSprintCompleted }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSprint, setEditingSprint] = useState(null)
  const [completingSprint, setCompletingSprint] = useState(null)
  const [hoveredSprintId, setHoveredSprintId] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-700'
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDeleteSprint = async (sprintId) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return

    try {
      await axios.delete(`/api/boards/${boardId}/sprints/${sprintId}`)
      onSprintDeleted(sprintId)
    } catch (error) {
      console.error('Delete sprint error:', error)
    }
  }

  const handleCompleteSprint = async () => {
    if (!completingSprint) return

    try {
      const res = await axios.post(`/api/boards/${boardId}/sprints/${completingSprint.id}/complete`)
      onSprintUpdated(res.data.sprint)

      // Wait for board to refresh before closing dialog
      if (onSprintCompleted) {
        await onSprintCompleted(completingSprint.id)
      }

      setCompletingSprint(null)
    } catch (error) {
      console.error('Complete sprint error:', error)
      const errorMessage = error.response?.data?.error || 'Failed to complete sprint'
      alert(errorMessage)
      throw error // Re-throw to keep dialog open on error
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0F172A]">Sprints</h2>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#E5E7EB] hover:text-[#0F172A] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add Sprint Button */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 cursor-pointer"
                >
                  <Plus size={18} />
                  Create Sprint
                </button>
              </div>

              {/* Sprint List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sprints && sprints.length > 0 ? (
                  sprints.map((sprint, index) => {
                    const sprintNumber = sprints.length - index
                    return (
                      <div
                        key={sprint.id}
                        onMouseEnter={() => setHoveredSprintId(sprint.id)}
                        onMouseLeave={() => setHoveredSprintId(null)}
                        className="group relative rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                      >
                        {/* Header with Sprint Number and Status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0F172A] border-l-2 border-blue-500 pl-2">
                              Sprint {sprintNumber}
                            </span>
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(sprint.status)}`}
                            >
                              {sprint.status}
                            </span>
                          </div>
                          {/* Hover Actions */}
                          <div
                            className={`flex items-center gap-1 transition-opacity ${
                              hoveredSprintId === sprint.id ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            {sprint.status !== 'COMPLETED' && (
                              <button
                                onClick={() => setCompletingSprint(sprint)}
                                className="rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-50"
                                title="Complete Sprint"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingSprint(sprint)}
                              className="rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#E5E7EB] cursor-pointer"
                              title="Edit Sprint"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSprint(sprint.id)}
                              className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                              title="Delete Sprint"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Sprint Name */}
                        <h3 className="font-bold text-[#0F172A] text-base mb-2">{sprint.name}</h3>

                        {/* Sprint Goal */}
                        {sprint.goal && (
                          <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{sprint.goal}</p>
                        )}

                        {/* Dates */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-[#64748B]">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="font-medium">Start:</span>
                            <span>{formatDate(sprint.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#64748B]">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="font-medium">End:</span>
                            <span>{formatDate(sprint.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[#64748B] text-sm">No sprints yet</p>
                    <p className="text-[#94A3B8] text-xs mt-1">
                      Click &quot;Create Sprint&quot; to get started
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showCreateDialog && (
        <CreateSprintDialog
          boardId={boardId}
          onClose={() => setShowCreateDialog(false)}
          onCreated={(sprint) => {
            onSprintCreated(sprint)
            setShowCreateDialog(false)
          }}
        />
      )}

      {editingSprint && (
        <EditSprintDialog
          boardId={boardId}
          sprint={editingSprint}
          onClose={() => setEditingSprint(null)}
          onUpdated={(updatedSprint) => {
            onSprintUpdated(updatedSprint)
            setEditingSprint(null)
          }}
        />
      )}

      {completingSprint && (
        <CompleteSprintDialog
          sprintName={completingSprint.name}
          onClose={() => setCompletingSprint(null)}
          onConfirm={handleCompleteSprint}
        />
      )}
    </>
  )
}
