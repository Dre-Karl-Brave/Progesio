'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { SquareCheckBig, LayoutDashboard, X, MessageSquarePlus } from 'lucide-react'
import TaskIntelligenceDialog from './TaskIntelligenceDialog'
import BoardIntelligenceDialog from './BoardIntelligenceDialog'
import TaskCreationChatDialog from './TaskCreationChatDialog'
import { timeRangeToDueDate } from './taskIntelligence/timeRangeToDueDate'
import { toast } from '@/app/modules/toast/toastUtils'

const options = [
  { id: 'create', label: 'Create task with AI', Icon: MessageSquarePlus },
  { id: 'task', label: 'Task-level intelligence', Icon: SquareCheckBig },
  { id: 'board', label: 'Board-level intelligence', Icon: LayoutDashboard }
]

const BTN_SIZE = 44

export default function AIButton({ tasks = [], boardId, columns = [], members = [], sprints = [], onTasksUpdated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showBoardDialog, setShowBoardDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleApplyEstimates = async (estimates) => {
    await Promise.all(
      estimates.map((estimate) =>
        axios.patch(`/api/boards/${boardId}/tasks/${estimate.id}`, {
          dueDate: timeRangeToDueDate(estimate.timeRange).toISOString()
        })
      )
    )
    onTasksUpdated?.()
    toast.success(`Due dates updated for ${estimates.length} task${estimates.length !== 1 ? 's' : ''}.`)
  }

  const handleApplySubtasks = async (subtaskResults, allTasks, deleteMainTasks = false) => {
    const created = subtaskResults.flatMap((r) => r.items)
    await Promise.all(
      subtaskResults.flatMap((result) => {
        const parent = allTasks.find((t) => t.id === result.parentId)
        if (!parent?.columnId) return []
        return result.items.map((item) =>
          axios.post(`/api/boards/${boardId}/tasks`, {
            title: item.title,
            description: item.description || '',
            columnId: parent.columnId,
            priority: 'low'
          })
        )
      })
    )
    if (deleteMainTasks) {
      await Promise.all(
        subtaskResults.map((result) =>
          axios.delete(`/api/boards/${boardId}/tasks/${result.parentId}`)
        )
      )
    }
    onTasksUpdated?.()
    const deletedMsg = deleteMainTasks ? `, ${subtaskResults.length} original task${subtaskResults.length !== 1 ? 's' : ''} deleted` : ''
    toast.success(`${created.length} subtask${created.length !== 1 ? 's' : ''} created across ${subtaskResults.length} task${subtaskResults.length !== 1 ? 's' : ''}${deletedMsg}.`)
  }

  const handleApplyOrganize = async (suggestions) => {
    const changed = suggestions.filter((s) => s.changed)
    await Promise.all(
      changed.map((s) =>
        axios.patch(`/api/boards/${boardId}/tasks/${s.id}`, {
          priority: s.suggestedPriority
        })
      )
    )
    onTasksUpdated?.()
    toast.success(`Priority updated for ${changed.length} task${changed.length !== 1 ? 's' : ''}.`)
  }

  const handleApplyWorkload = async (suggestions) => {
    await Promise.all(
      suggestions.map((s) =>
        axios.patch(`/api/boards/${boardId}/tasks/${s.taskId}`, {
          assigneeId: s.toUserId
        })
      )
    )
    onTasksUpdated?.()
    toast.success(`${suggestions.length} task${suggestions.length !== 1 ? 's' : ''} reassigned successfully.`)
  }

  const handleClick = (id) => {
    if (id === 'create') setShowCreateDialog(true)
    if (id === 'task') setShowTaskDialog(true)
    if (id === 'board') setShowBoardDialog(true)
    setIsOpen(false)
    setHoveredId(null)
  }

  const toggleOpen = () => {
    setIsOpen((v) => !v)
    setHoveredId(null)
  }

  return (
    <>
      <div className='fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              // ↕ Increase or decrease gap between the 2 option buttons here
              className='flex flex-col items-center gap-3'
              initial='hidden'
              animate='visible'
              exit='hidden'
            >
              {options.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  className='relative flex items-center justify-end'
                  variants={{
                    hidden: { opacity: 0, y: 6, scale: 0.88 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { delay: i * 0.05, type: 'spring', stiffness: 380, damping: 22 }
                    }
                  }}
                >
                  <AnimatePresence>
                    {hoveredId === opt.id && (
                      <motion.span
                        className='absolute whitespace-nowrap text-xs font-medium pointer-events-none select-none'
                        style={{
                          right: BTN_SIZE + 8,
                          background: '#0F172A',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: 5
                        }}
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.12 }}
                      >
                        {opt.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => handleClick(opt.id)}
                    onMouseEnter={() => setHoveredId(opt.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className='flex items-center justify-center rounded-full cursor-pointer'
                    animate={{
                      background: hoveredId === opt.id ? '#0F172A' : '#ffffff',
                      color: hoveredId === opt.id ? '#ffffff' : '#0F172A'
                    }}
                    transition={{ duration: 0.13 }}
                    style={{
                      width: BTN_SIZE,
                      height: BTN_SIZE,
                      border: '1.5px solid #0F172A',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.09)'
                    }}
                    whileTap={{ scale: 0.93 }}
                  >
                    <opt.Icon size={16} strokeWidth={1.8} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleOpen}
          className='flex items-center justify-center rounded-full cursor-pointer'
          animate={{ scale: isOpen ? 1.07 : 1 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: BTN_SIZE,
            height: BTN_SIZE,
            background: '#0F172A',
            boxShadow: isOpen ? '0 4px 18px rgba(0,0,0,0.22)' : '0 2px 8px rgba(0,0,0,0.13)',
            border: '1.5px solid #0F172A'
          }}
        >
          <AnimatePresence mode='wait'>
            {isOpen ? (
              <motion.span
                key='close'
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className='flex items-center justify-center text-white'
              >
                <X size={16} strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.svg
                key='ai'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                initial={{ opacity: 0, rotate: 20, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -20, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                style={{ color: '#fff' }}
              >
                <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.5' opacity='0.5' />
                <circle cx='12' cy='12' r='2' stroke='currentColor' strokeWidth='1.5' fill='none' />
                <circle cx='12' cy='6' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <circle cx='17.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <circle cx='17.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <circle cx='12' cy='18' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <circle cx='6.5' cy='14' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <circle cx='6.5' cy='10' r='1.5' stroke='currentColor' strokeWidth='1.2' fill='none' opacity='0.8' />
                <line x1='12' y1='12' x2='12' y2='6' stroke='currentColor' strokeWidth='1' opacity='0.3' />
                <line x1='12' y1='12' x2='17.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
                <line x1='12' y1='12' x2='17.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
                <line x1='12' y1='12' x2='12' y2='18' stroke='currentColor' strokeWidth='1' opacity='0.3' />
                <line x1='12' y1='12' x2='6.5' y2='14' stroke='currentColor' strokeWidth='1' opacity='0.3' />
                <line x1='12' y1='12' x2='6.5' y2='10' stroke='currentColor' strokeWidth='1' opacity='0.3' />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <TaskCreationChatDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} boardId={boardId} columns={columns} members={members} sprints={sprints} onTaskCreated={onTasksUpdated} />
      <TaskIntelligenceDialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)} onApply={handleApplyEstimates} onApplySubtasks={handleApplySubtasks} onApplyOrganize={handleApplyOrganize} tasks={tasks} boardId={boardId} />
      <BoardIntelligenceDialog open={showBoardDialog} onClose={() => setShowBoardDialog(false)} boardId={boardId} onApplyWorkload={handleApplyWorkload} />
    </>
  )
}
