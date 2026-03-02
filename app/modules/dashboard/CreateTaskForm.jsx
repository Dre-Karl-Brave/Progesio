'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function CreateTaskForm({ members, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assigneeId, setAssigneeId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      await onSubmit({ title, priority, assigneeId: assigneeId || undefined })
      setTitle('')
      setPriority('medium')
      setAssigneeId('')
    } catch {
      setError(DASHBOARD_DATA.createTask.errorFallback)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-[#E5E7EB] bg-white p-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={DASHBOARD_DATA.createTask.placeholder}
        autoFocus
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20"
      >
        {Object.entries(DASHBOARD_DATA.priorities).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      {members && members.length > 0 && (
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
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-md bg-[#0F172A] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50"
        >
          {DASHBOARD_DATA.createTask.addButton}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC]"
        >
          {DASHBOARD_DATA.createTask.cancelButton}
        </button>
      </div>
    </form>
  )
}
