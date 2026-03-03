'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import DashboardShell from './DashboardShell'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import MembersPanel from './MembersPanel'
import AddMemberModal from './AddMemberModal'
import TaskDetailModal from './TaskDetailModal'
import DeleteBoardDialog from './DeleteBoardDialog'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function KanbanBoard({ boardId }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newColumnName, setNewColumnName] = useState('')
  const [addingColumn, setAddingColumn] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const boardRef = useRef(board)
  const assigneeFilter = searchParams.get('assignee')

  const updateBoard = useCallback((updater) => {
    setBoard((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      boardRef.current = next
      return next
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const fetchBoard = useCallback(async () => {
    try {
      const res = await axios.get(`/api/boards/${boardId}`)
      updateBoard(res.data.board)
    } catch {
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [boardId, router, updateBoard])

  useEffect(() => {
    fetchBoard()
    axios.get('/api/auth/me').then((res) => setCurrentUserId(res.data.user.id)).catch(() => {})
  }, [fetchBoard])

  const findColumnByTaskIdFromRef = (taskId) => {
    return boardRef.current?.columns.find((col) => col.tasks?.some((t) => t.id === taskId))
  }

  const handleDragStart = (event) => {
    const { active } = event
    const column = findColumnByTaskIdFromRef(active.id)
    const task = column?.tasks?.find((t) => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over || !boardRef.current) return

    const activeId = active.id
    const overId = over.id

    const sourceColumn = findColumnByTaskIdFromRef(activeId)
    if (!sourceColumn) return

    let targetColumnId
    let overTaskIndex = -1

    if (String(overId).startsWith('column-')) {
      targetColumnId = String(overId).replace('column-', '')
    } else {
      const targetCol = findColumnByTaskIdFromRef(overId)
      targetColumnId = targetCol?.id
      overTaskIndex = targetCol?.tasks?.findIndex((t) => t.id === overId) ?? -1
    }

    if (!targetColumnId || sourceColumn.id === targetColumnId) return

    updateBoard((prev) => {
      const prevSourceCol = prev.columns.find((col) => col.id === sourceColumn.id)
      const task = prevSourceCol?.tasks?.find((t) => t.id === activeId)
      if (!task) return prev

      const newColumns = prev.columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: (col.tasks || []).filter((t) => t.id !== activeId) }
        }
        if (col.id === targetColumnId) {
          const newTasks = [...(col.tasks || [])]
          const insertIndex = overTaskIndex >= 0 ? overTaskIndex : newTasks.length
          newTasks.splice(insertIndex, 0, { ...task, columnId: targetColumnId })
          return { ...col, tasks: newTasks }
        }
        return col
      })

      return { ...prev, columns: newColumns }
    })
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || !boardRef.current) return

    const activeId = active.id
    const overId = over.id

    const sourceColumn = findColumnByTaskIdFromRef(activeId)
    if (!sourceColumn) return

    if (!String(overId).startsWith('column-')) {
      const overColumn = findColumnByTaskIdFromRef(overId)
      if (overColumn && sourceColumn.id === overColumn.id) {
        const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId)
        const newIndex = sourceColumn.tasks.findIndex((t) => t.id === overId)

        if (oldIndex !== newIndex) {
          const reordered = arrayMove(sourceColumn.tasks, oldIndex, newIndex)

          updateBoard((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
              col.id === sourceColumn.id ? { ...col, tasks: reordered } : col
            ),
          }))

          try {
            await axios.patch(`/api/boards/${boardId}/tasks/${activeId}`, {
              columnId: sourceColumn.id,
              position: newIndex,
            })
          } catch {
            fetchBoard()
          }
          return
        }
      }
    }

    const currentColumn = findColumnByTaskIdFromRef(activeId)
    if (!currentColumn) return

    const newPosition = currentColumn.tasks.findIndex((t) => t.id === activeId)

    try {
      await axios.patch(`/api/boards/${boardId}/tasks/${activeId}`, {
        columnId: currentColumn.id,
        position: newPosition >= 0 ? newPosition : 0,
      })
    } catch {
      fetchBoard()
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    fetchBoard()
  }

  const handleCreateTask = async ({ title, priority, columnId, assigneeId }) => {
    const res = await axios.post(`/api/boards/${boardId}/tasks`, {
      title, priority, columnId, assigneeId: assigneeId || undefined,
    })
    updateBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...(col.tasks || []), res.data.task] } : col
      ),
    }))
  }

  const handleDeleteTask = async (taskId) => {
    await axios.delete(`/api/boards/${boardId}/tasks/${taskId}`)
    updateBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        tasks: (col.tasks || []).filter((t) => t.id !== taskId),
      })),
    }))
  }

  const handleUpdateTask = async (taskId, data) => {
    const res = await axios.patch(`/api/boards/${boardId}/tasks/${taskId}`, data)
    updateBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        tasks: (col.tasks || []).map((t) => (t.id === taskId ? { ...t, ...res.data.task } : t)),
      })),
    }))
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const handleAddColumn = async (e) => {
    e.preventDefault()
    if (!newColumnName.trim()) return
    setAddingColumn(true)
    try {
      const res = await axios.post(`/api/boards/${boardId}/columns`, { name: newColumnName })
      updateBoard((prev) => ({ ...prev, columns: [...prev.columns, res.data.column] }))
      setNewColumnName('')
    } catch {
      // ignore
    } finally {
      setAddingColumn(false)
    }
  }

  const handleDeleteColumn = async (columnId) => {
    await axios.delete(`/api/boards/${boardId}/columns/${columnId}`)
    updateBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }))
  }

  const handleDeleteBoard = async () => {
    await axios.delete(`/api/boards/${boardId}`)
    router.push('/dashboard')
  }

  const handleAddMember = async (email) => {
    const res = await axios.post(`/api/boards/${boardId}/members`, { email })
    updateBoard((prev) => ({
      ...prev,
      members: [...prev.members, res.data.member],
    }))
  }

  const handleRemoveMember = async (memberId) => {
    await axios.delete(`/api/boards/${boardId}/members/${memberId}`)
    updateBoard((prev) => {
      const removedMember = prev.members.find((m) => m.id === memberId)
      return {
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
        columns: prev.columns.map((col) => ({
          ...col,
          tasks: (col.tasks || []).map((t) =>
            t.assigneeId === removedMember?.userId ? { ...t, assigneeId: null, assignee: null } : t
          ),
        })),
      }
    })
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="py-20 text-center text-sm text-[#475569]">Loading...</div>
      </DashboardShell>
    )
  }

  if (!board) return null

  const isOwner = currentUserId && board.ownerId === currentUserId

  // Filter board columns based on assignee filter
  const filteredBoard = assigneeFilter
    ? {
        ...board,
        columns: board.columns.map((column) => ({
          ...column,
          tasks: (column.tasks || []).filter((task) => task.assigneeId === assigneeFilter),
        })),
      }
    : board

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between mt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#E5E7EB] hover:text-[#0F172A] cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">{board.name}</h1>
            {board.description && (
              <p className="text-sm text-[#475569]">{board.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {board.members && (
            <MembersPanel
              members={board.members}
              isOwner={isOwner}
              onAddClick={() => setShowAddMemberModal(true)}
              onRemoveMember={handleRemoveMember}
            />
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredBoard.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              members={board.members || []}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              onDeleteColumn={handleDeleteColumn}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTask}
            />
          ))}

          <div className="w-72 shrink-0">
            <form onSubmit={handleAddColumn} className="flex gap-2">
              <Input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder={DASHBOARD_DATA.kanban.addColumnPlaceholder}
                className="flex-1"
              />
              <button
                type="submit"
                disabled={addingColumn || !newColumnName.trim()}
                className="flex items-center gap-1 rounded-md bg-[#0F172A] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onDelete={() => {}} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          members={board.members || []}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showDeleteDialog && (
        <DeleteBoardDialog
          boardName={board.name}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteBoard}
        />
      )}

      <button
        onClick={() => setShowDeleteDialog(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-lg transition-all hover:bg-red-50 hover:shadow-xl cursor-pointer"
      >
        <Trash2 size={16} />
        Delete Board
      </button>
    </DashboardShell>
  )
}
