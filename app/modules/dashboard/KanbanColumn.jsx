'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Trash2, Plus } from 'lucide-react'
import TaskCard from './TaskCard'
import CreateTaskForm from './CreateTaskForm'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function KanbanColumn({
  column,
  members,
  onCreateTask,
  onDeleteTask,
  onDeleteColumn,
  onTaskClick,
  onUpdateTask,
}) {
  const [showForm, setShowForm] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { type: 'column', columnId: column.id },
  })

  const handleDeleteColumn = () => {
    if (window.confirm(DASHBOARD_DATA.kanban.deleteColumnConfirm)) {
      onDeleteColumn(column.id)
    }
  }

  const taskIds = column.tasks?.map((t) => t.id) || []

  return (
    <div
      className={`flex w-72 shrink-0 flex-col rounded-xl border bg-[#F8FAFC] transition-colors ${
        isOver ? 'border-blue-300 bg-blue-50/50' : 'border-[#E5E7EB]'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-3 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#0F172A]">{column.name}</h3>
          <span className="rounded-full bg-[#E5E7EB] px-2 py-0.5 text-xs font-medium text-[#475569]">
            {column.tasks?.length || 0}
          </span>
        </div>
        <button
          onClick={handleDeleteColumn}
          className="rounded p-1 text-[#475569] transition-colors hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="min-h-[48px] flex-1 space-y-2 overflow-y-auto p-3">
          {column.tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              members={members}
              onDelete={onDeleteTask}
              onClick={() => onTaskClick?.(task)}
              onUpdate={onUpdateTask}
            />
          ))}
        </div>
      </SortableContext>

      <div className="border-t border-[#E5E7EB] p-3">
        {showForm ? (
          <CreateTaskForm
            members={members}
            onSubmit={(data) => onCreateTask({ ...data, columnId: column.id })}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-sm text-[#475569] transition-colors hover:bg-white hover:text-[#0F172A]"
          >
            <Plus size={14} />
            Add a task
          </button>
        )}
      </div>
    </div>
  )
}
