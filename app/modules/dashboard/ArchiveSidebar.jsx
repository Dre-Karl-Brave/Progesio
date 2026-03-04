'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil, Trash2, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import EditBoardDialog from './EditBoardDialog'
import DeleteBoardDialog from './DeleteBoardDialog'
import axios from 'axios'

export default function ArchiveSidebar({ isOpen, onClose, archivedBoards, onBoardRestored, onBoardUpdated, onBoardDeleted }) {
  const [editingBoard, setEditingBoard] = useState(null)
  const [deletingBoard, setDeletingBoard] = useState(null)
  const [hoveredBoardId, setHoveredBoardId] = useState(null)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleRestoreBoard = async (boardId) => {
    try {
      const res = await axios.post(`/api/boards/${boardId}/restore`)
      onBoardRestored(res.data.board)
    } catch (error) {
      console.error('Restore board error:', error)
      alert('Failed to restore board')
    }
  }

  const handlePermanentDelete = async () => {
    if (!deletingBoard) return

    try {
      await axios.delete(`/api/boards/${deletingBoard.id}`)
      onBoardDeleted(deletingBoard.id)
      setDeletingBoard(null)
    } catch (error) {
      console.error('Permanent delete board error:', error)
      alert('Failed to delete board')
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
                <h2 className="text-xl font-bold text-[#0F172A]">Archive</h2>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#E5E7EB] hover:text-[#0F172A] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Archived Boards List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {archivedBoards && archivedBoards.length > 0 ? (
                  archivedBoards.map((board) => (
                    <div
                      key={board.id}
                      onMouseEnter={() => setHoveredBoardId(board.id)}
                      onMouseLeave={() => setHoveredBoardId(null)}
                      className="group relative rounded-lg border border-gray-200 bg-linear-to-br from-white to-gray-50 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      {/* Header with Actions */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0F172A] text-base">{board.name}</h3>
                        </div>
                        {/* Hover Actions */}
                        <div
                          className={`flex items-center gap-1 transition-opacity ${
                            hoveredBoardId === board.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <button
                            onClick={() => handleRestoreBoard(board.id)}
                            className="rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-50 cursor-pointer"
                            title="Restore Board"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => setEditingBoard(board)}
                            className="rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#E5E7EB] cursor-pointer"
                            title="Edit Board"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingBoard(board)}
                            className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Board Description */}
                      {board.description && (
                        <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{board.description}</p>
                      )}

                      {/* Archived Date */}
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-[#64748B]">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                          <span className="font-medium">Archived:</span>
                          <span>{board.archivedAt ? formatDate(board.archivedAt) : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[#64748B] text-sm">No archived boards</p>
                    <p className="text-[#94A3B8] text-xs mt-1">
                      Deleted boards will appear here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {editingBoard && (
        <EditBoardDialog
          board={editingBoard}
          onClose={() => setEditingBoard(null)}
          onUpdated={(updatedBoard) => {
            onBoardUpdated(updatedBoard)
            setEditingBoard(null)
          }}
        />
      )}

      {deletingBoard && (
        <DeleteBoardDialog
          boardName={deletingBoard.name}
          onClose={() => setDeletingBoard(null)}
          onConfirm={handlePermanentDelete}
        />
      )}
    </>
  )
}
