'use client'

import { useState } from 'react'
import { Select, MenuItem, FormControl } from '@mui/material'
import { Input } from '@/components/ui/input'
import { DASHBOARD_DATA } from '@/app/constants/dashboard/constants'

export default function CreateTaskForm({ members, sprints, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [sprintId, setSprintId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      await onSubmit({ title, priority, sprintId: sprintId || undefined, assigneeId: assigneeId || undefined })
      setTitle('')
      setPriority('medium')
      setSprintId('')
      setAssigneeId('')
    } catch {
      setError(DASHBOARD_DATA.createTask.errorFallback)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
      <div className="mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={DASHBOARD_DATA.createTask.placeholder}
          autoFocus
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mb-4">{error}</p>
      )}
      <div className="mb-4">
        <FormControl fullWidth>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{
              height: '38px',
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E5E7EB',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0F172A',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0F172A',
                borderWidth: '2px',
              },
            }}
          >
            {Object.entries(DASHBOARD_DATA.priorities).map(([key, { label }]) => (
              <MenuItem key={key} value={key} sx={{ fontSize: '0.875rem' }}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {sprints && sprints.length > 0 && (
        <div className="mb-4">
          <FormControl fullWidth>
            <Select
              value={sprintId}
              onChange={(e) => setSprintId(e.target.value)}
              displayEmpty
              sx={{
                height: '38px',
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0F172A',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0F172A',
                  borderWidth: '2px',
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                Backlog (No Sprint)
              </MenuItem>
              {sprints.map((sprint, index) => {
                const sprintNumber = sprints.length - index
                return (
                  <MenuItem
                    key={sprint.id}
                    value={sprint.id}
                    sx={{ fontSize: '0.875rem' }}
                    disabled={sprint.status === 'COMPLETED'}
                  >
                    Sprint {sprintNumber} - {sprint.name} ({sprint.status})
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
      )}
      {members && members.length > 0 && (
        <div className="mb-4">
          <FormControl fullWidth>
            <Select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              displayEmpty
              sx={{
                height: '38px',
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0F172A',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0F172A',
                  borderWidth: '2px',
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                {DASHBOARD_DATA.createTask.unassigned}
              </MenuItem>
              {members.map((member) => (
                <MenuItem key={member.user.id} value={member.user.id} sx={{ fontSize: '0.875rem' }}>
                  {member.user.name || member.user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-md bg-[#0F172A] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0F172A]/90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {DASHBOARD_DATA.createTask.addButton}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-sm text-[#475569] transition-colors hover:bg-[#F8FAFC] cursor-pointer"
        >
          {DASHBOARD_DATA.createTask.cancelButton}
        </button>
      </div>
    </form>
  )
}
