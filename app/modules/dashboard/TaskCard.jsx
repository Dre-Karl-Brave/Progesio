'use client'

import { useState, useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Calendar, UserCircle } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'
import DeleteTaskDialog from './DeleteTaskDialog'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
]

function getAvatarColor(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function parseLabel(label) {
  const colonIdx = label.indexOf(':')
  if (colonIdx > 0) {
    return { color: label.slice(0, colonIdx), text: label.slice(colonIdx + 1) }
  }
  return { color: '#6B7280', text: label }
}

export default function TaskCard({ task, onDelete, onClick, isDragOverlay, members, onUpdate }) {
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const dropdownRef = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityConfig = DASHBOARD_DATA.priorities[task.priority] || DASHBOARD_DATA.priorities.medium

  useEffect(() => {
    if (!showAssigneeDropdown) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAssigneeDropdown(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowAssigneeDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showAssigneeDropdown])

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete(task.id)
    setShowDeleteDialog(false)
  }

  const handleClick = (e) => {
    if (onClick) onClick()
  }

  const handleAssigneeClick = (e) => {
    e.stopPropagation()
    setShowAssigneeDropdown((prev) => !prev)
  }

  const handleAssign = (userId) => {
    setShowAssigneeDropdown(false)
    if (onUpdate) {
      onUpdate(task.id, { assigneeId: userId || null })
    }
  }

  if (isDragOverlay) {
    return (
      <div className="w-72 rotate-2 rounded-lg border-2 border-blue-400 bg-white p-3 shadow-xl ring-2 ring-blue-200">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink-0 text-[#94A3B8]">
            <GripVertical size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#0F172A]">{task.title}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: priorityConfig.color }}
              >
                {priorityConfig.label}
              </span>
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-[#475569]">
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative cursor-grab rounded-lg border bg-white p-3 shadow-sm transition-colors active:cursor-grabbing ${
        isDragging
          ? 'border-blue-300 opacity-40'
          : 'border-[#E5E7EB] hover:border-[#CBD5E1]'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 shrink-0 text-[#94A3B8] transition-colors">
          <GripVertical size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-[#0F172A]">{task.title}</p>
            <button
              onClick={handleDelete}
              className="shrink-0 rounded p-0.5 text-[#94A3B8] opacity-0 transition-all hover:text-red-500 group-hover:opacity-100 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-[#475569] line-clamp-2">{task.description}</p>
          )}
          {task.labels && task.labels.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {task.labels.map((label) => {
                const { color, text } = parseLabel(label)
                return (
                  <span
                    key={label}
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    {text}
                  </span>
                )
              })}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: priorityConfig.color }}
              >
                {priorityConfig.label}
              </span>
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-[#475569]">
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleAssigneeClick}
                className="shrink-0 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                title={task.assignee ? (task.assignee.name || task.assignee.email) : 'Unassigned'}
              >
                {task.assignee ? (
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ${getAvatarColor(task.assignee.id)}`}
                  >
                    {getInitials(task.assignee.name || task.assignee.email)}
                  </div>
                ) : (
                  <UserCircle size={22} className="text-[#94A3B8]" strokeWidth={1.5} strokeDasharray="3 2" />
                )}
              </button>
              {showAssigneeDropdown && members && (
                <div className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
                  <button
                    onClick={() => handleAssign(null)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[#475569] hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    <UserCircle size={18} className="text-[#94A3B8]" />
                    {DASHBOARD_DATA.createTask.unassigned}
                  </button>
                  {members.map((member) => (
                    <button
                      key={member.user.id}
                      onClick={() => handleAssign(member.user.id)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white ${getAvatarColor(member.user.id)}`}
                      >
                        {getInitials(member.user.name || member.user.email)}
                      </div>
                      {member.user.name || member.user.email}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteTaskDialog
          taskTitle={task.title}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}
