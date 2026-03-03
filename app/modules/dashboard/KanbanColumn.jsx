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
  onUpdateTask
}) {
  const [showForm, setShowForm] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { type: 'column', columnId: column.id }
  })

  const handleDeleteColumn = () => {
    if (window.confirm(DASHBOARD_DATA.kanban.deleteColumnConfirm)) {
      onDeleteColumn(column.id)
    }
  }

  const taskIds = column.tasks?.map((t) => t.id) || []

  return (
    <div
      className={`flex w-72 shrink-0 flex-col rounded-xl shadow-sm transition-all min-h-[600px] ${
        isOver ? 'bg-blue-50 shadow-md ring-2 ring-blue-200' : 'bg-linear-to-b from-[#F8FAFC] to-[#F1F5F9]'
      }`}
    >
      <div className='flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-t-xl border-b border-[#E5E7EB] px-3 py-3'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm font-semibold text-[#0F172A]'>{column.name}</h3>
          <span className='rounded-full bg-[#E5E7EB] px-2 py-0.5 text-xs font-medium text-[#475569]'>
            {column.tasks?.length || 0}
          </span>
        </div>
        <button
          onClick={handleDeleteColumn}
          className='rounded p-1 text-[#475569] transition-colors hover:text-red-500 cursor-pointer'
        >
          <Trash2 size={14} />
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className='min-h-100 flex-1 space-y-2 overflow-y-auto p-3'>
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

          <div className='pt-1'>
            {showForm ? (
              <div className='rounded-lg bg-white/90 backdrop-blur-sm p-2 shadow-sm'>
                <CreateTaskForm
                  members={members}
                  onSubmit={(data) => onCreateTask({ ...data, columnId: column.id })}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className='flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[#CBD5E1] bg-white/60 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#0F172A] hover:bg-white hover:text-[#0F172A] cursor-pointer'
              >
                <Plus size={16} />
                Add a task
              </button>
            )}
          </div>
        </div>
      </SortableContext>
    </div>
  )
}
