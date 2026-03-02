'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { X, Trash2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getInitials } from '@/lib/utils'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function TaskDetailModal({ task, members, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority)
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '')
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [labels, setLabels] = useState(task.labels || [])
  const [newLabel, setNewLabel] = useState('')
  const [selectedColor, setSelectedColor] = useState(DASHBOARD_DATA.labels.colors[0].value)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSave(task.id, {
        title,
        description,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
        labels,
      })
      onClose()
    } catch {
      // handled by parent
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm(DASHBOARD_DATA.taskCard.deleteConfirm)) {
      onDelete(task.id)
      onClose()
    }
  }

  const addLabel = () => {
    if (!newLabel.trim()) return
    const label = `${selectedColor}:${newLabel.trim()}`
    if (!labels.includes(label)) {
      setLabels([...labels, label])
    }
    setNewLabel('')
  }

  const removeLabel = (label) => {
    setLabels(labels.filter((l) => l !== label))
  }

  const parseLabel = (label) => {
    const colonIdx = label.indexOf(':')
    if (colonIdx > 0) {
      return { color: label.slice(0, colonIdx), text: label.slice(colonIdx + 1) }
    }
    return { color: '#6B7280', text: label }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {DASHBOARD_DATA.taskDetail.title}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#475569] transition-colors hover:text-[#0F172A]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              {DASHBOARD_DATA.taskDetail.descriptionLabel}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={DASHBOARD_DATA.taskDetail.descriptionPlaceholder}
              rows={3}
              className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                {DASHBOARD_DATA.taskDetail.priorityLabel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
              >
                {Object.entries(DASHBOARD_DATA.priorities).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                {DASHBOARD_DATA.taskDetail.assigneeLabel}
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
              >
                <option value="">{DASHBOARD_DATA.createTask.unassigned}</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name || member.user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                {DASHBOARD_DATA.taskDetail.dueDateLabel}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#0F172A]">
              {DASHBOARD_DATA.taskDetail.labelsLabel}
            </label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {labels.map((label) => {
                const { color, text } = parseLabel(label)
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    {text}
                    <button onClick={() => removeLabel(label)} className="hover:opacity-75">
                      <X size={12} />
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {DASHBOARD_DATA.labels.colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={`h-5 w-5 rounded-full border-2 transition-all ${
                      selectedColor === c.value ? 'border-[#0F172A] scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={DASHBOARD_DATA.taskDetail.addLabelPlaceholder}
                className="flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel() } }}
              />
              <button
                type="button"
                onClick={addLabel}
                disabled={!newLabel.trim()}
                className="rounded-md bg-[#F8FAFC] p-2 text-[#475569] transition-colors hover:bg-[#E5E7EB] disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              {DASHBOARD_DATA.taskDetail.deleteButton}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-md border border-[#E5E7EB] px-4 py-2 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !title.trim()}
                className="rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50"
              >
                {loading ? DASHBOARD_DATA.taskDetail.savingButton : DASHBOARD_DATA.taskDetail.saveButton}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
