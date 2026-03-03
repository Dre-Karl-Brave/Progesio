'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Plus, LayoutDashboard } from 'lucide-react'
import { motion } from 'motion/react'
import DashboardShell from './DashboardShell'
import BoardCard from './BoardCard'
import BoardCardSkeleton from './BoardCardSkeleton'
import CreateBoardModal from './CreateBoardModal'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function BoardList() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchBoards = useCallback(async () => {
    try {
      const res = await axios.get('/api/boards')
      setBoards(res.data.boards)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const handleCreate = async ({ name, description }) => {
    const res = await axios.post('/api/boards', { name, description })
    setBoards((prev) => [res.data.board, ...prev])
  }

  const handleDelete = async (boardId) => {
    try {
      await axios.delete(`/api/boards/${boardId}`)
      setBoards((prev) => prev.filter((b) => b.id !== boardId))
    } catch {
      // ignore
    }
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0F172A]">{DASHBOARD_DATA.boardList.title}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 hover:cursor-pointer"
        >
          <Plus size={16} />
          {DASHBOARD_DATA.boardList.newBoardButton}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <BoardCardSkeleton key={i} />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <LayoutDashboard size={48} className="text-[#E5E7EB]" />
          <h2 className="mt-4 text-lg font-semibold text-[#0F172A]">
            {DASHBOARD_DATA.boardList.emptyTitle}
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            {DASHBOARD_DATA.boardList.emptyDescription}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateBoardModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </DashboardShell>
  )
}
