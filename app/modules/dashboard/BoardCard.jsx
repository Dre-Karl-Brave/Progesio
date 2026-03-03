'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Columns3, Users, Trash2 } from 'lucide-react'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function BoardCard({ board, onDelete }) {
  const router = useRouter()

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(DASHBOARD_DATA.boardList.deleteConfirm)) {
      onDelete(board.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/dashboard/${board.id}`)}
      className="group cursor-pointer rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-[#0F172A]">{board.name}</h3>
        <button
          onClick={handleDelete}
          className="rounded p-1 text-[#475569] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 hover:cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {board.description && (
        <p className="mt-1.5 text-sm text-[#475569] line-clamp-2">{board.description}</p>
      )}
      <div className="mt-3 flex items-center gap-4 text-xs text-[#475569]">
        <span className="flex items-center gap-1.5">
          <Columns3 size={14} />
          {board.columns?.length || 0} {DASHBOARD_DATA.boardList.columnsLabel}
        </span>
        {board.members && (
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {board.members.length} {DASHBOARD_DATA.boardList.membersLabel}
          </span>
        )}
      </div>
    </motion.div>
  )
}
