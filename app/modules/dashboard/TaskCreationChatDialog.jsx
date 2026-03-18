'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, IconButton } from '@mui/material'
import { X, Send, CheckCircle2, Layers, User, Zap, Calendar, Tag } from 'lucide-react'
import axios from 'axios'
import { toast } from '@/app/modules/toast/toastUtils'

const PRIORITY_ACCENT = {
  urgent: '#DC2626',
  high:   '#EA580C',
  medium: '#CA8A04',
  low:    '#16A34A'
}

const PRIORITY_LABEL = {
  urgent: 'Urgent',
  high:   'High',
  medium: 'Medium',
  low:    'Low'
}

function TaskSuggestionCard({ suggestion, onConfirm, confirmed }) {
  const accent = PRIORITY_ACCENT[suggestion.priority] || PRIORITY_ACCENT.medium
  const label  = PRIORITY_LABEL[suggestion.priority]  || 'Medium'

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 12,
        border: '1px solid #E2E8F0',
        background: '#fff',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      {/* Priority strip */}
      <div style={{ height: 3, background: accent }} />

      <div style={{ padding: '14px 16px 16px' }}>
        {/* Title + priority */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, margin: 0 }}>
            {suggestion.title}
          </p>
          <span
            style={{
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: accent,
              background: `${accent}14`,
              borderRadius: 4,
              padding: '2px 6px'
            }}
          >
            {label}
          </span>
        </div>

        {/* Description */}
        {suggestion.description && (
          <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: '0 0 10px' }}>
            {suggestion.description}
          </p>
        )}

        {/* Metadata */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: suggestion.labels?.length ? 8 : 14 }}>
          <MetaChip icon={<Layers size={10} />} label={suggestion.columnName} />
          {suggestion.assigneeName && <MetaChip icon={<User     size={10} />} label={suggestion.assigneeName} />}
          {suggestion.sprintName   && <MetaChip icon={<Zap      size={10} />} label={suggestion.sprintName} />}
          {suggestion.dueDate      && <MetaChip icon={<Calendar size={10} />} label={new Date(suggestion.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />}
        </div>

        {/* Labels */}
        {suggestion.labels?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {suggestion.labels.map((l) => (
              <span
                key={l}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: '#6366F1',
                  background: '#EEF2FF',
                  borderRadius: 5,
                  padding: '3px 7px'
                }}
              >
                <Tag size={9} />
                {l}
              </span>
            ))}
          </div>
        )}

        {/* Action */}
        {confirmed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#16A34A' }}>
            <CheckCircle2 size={14} />
            Task created
          </div>
        ) : (
          <button
            onClick={onConfirm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#0F172A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Create task
          </button>
        )}
      </div>
    </div>
  )
}

function MetaChip({ icon, label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: '#475569',
        background: '#F1F5F9',
        borderRadius: 5,
        padding: '3px 7px'
      }}
    >
      {icon}
      {label}
    </span>
  )
}

function AIAvatar() {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: '#0F172A',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='12' cy='12' r='9' stroke='#fff' strokeWidth='1.5' opacity='0.5' />
        <circle cx='12' cy='12' r='2' stroke='#fff' strokeWidth='1.5' fill='none' />
        <circle cx='12' cy='6'  r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='17.5' cy='10' r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='17.5' cy='14' r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='12' cy='18' r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='6.5' cy='14' r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
        <circle cx='6.5' cy='10' r='1.5' stroke='#fff' strokeWidth='1.2' fill='none' opacity='0.8' />
      </svg>
    </div>
  )
}

function Message({ msg, onConfirmTask, confirmedIds }) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            maxWidth: '78%',
            background: '#0F172A',
            color: '#fff',
            borderRadius: '16px 16px 4px 16px',
            padding: '9px 14px',
            fontSize: 13,
            lineHeight: 1.5
          }}
        >
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <AIAvatar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E9EFF6',
            borderRadius: '4px 16px 16px 16px',
            padding: '9px 14px',
            fontSize: 13,
            color: '#0F172A',
            lineHeight: 1.5
          }}
        >
          {msg.content}
        </div>
        {msg.taskSuggestions?.map((suggestion, i) => (
          <TaskSuggestionCard
            key={i}
            suggestion={suggestion}
            onConfirm={() => onConfirmTask(`${msg.id}-${i}`, suggestion)}
            confirmed={confirmedIds.has(`${msg.id}-${i}`)}
          />
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <AIAvatar />
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid #E9EFF6',
          borderRadius: '4px 16px 16px 16px',
          padding: '11px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#94A3B8',
              display: 'inline-block',
              animation: 'aiDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        <style>{`
          @keyframes aiDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}

export default function TaskCreationChatDialog({ open, onClose, boardId, columns, members, sprints, onTaskCreated }) {
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [confirmedIds, setConfirmedIds] = useState(new Set())
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const nextId     = useRef(0)

  const makeId = () => String(nextId.current++)

  useEffect(() => {
    if (open) {
      setMessages([{
        id: makeId(),
        role: 'assistant',
        content: "Describe the task you'd like to create — mention priority, assignee, column, or sprint and I'll fill in the rest."
      }])
      setInput('')
      setConfirmedIds(new Set())
      nextId.current = 1
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const getHistory = () =>
    messages
      .filter((m) => m.id !== '0')
      .map((m) => ({ role: m.role, content: m.content }))

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post(`/api/boards/${boardId}/ai/create-task`, {
        message: text,
        columns,
        members,
        sprints,
        history: getHistory()
      })

      const suggestions = data.taskSuggestions?.length ? data.taskSuggestions : data.taskSuggestion ? [data.taskSuggestion] : []
      setMessages((prev) => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: data.reply || `Here ${suggestions.length === 1 ? 'is the task' : `are the ${suggestions.length} tasks`} I drafted.`,
        taskSuggestions: suggestions
      }])
    } catch {
      setMessages((prev) => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleConfirmTask = async (msgId, suggestion) => {
    try {
      await axios.post(`/api/boards/${boardId}/tasks`, {
        title:       suggestion.title,
        description: suggestion.description || '',
        priority:    suggestion.priority,
        columnId:    suggestion.columnId,
        assigneeId:  suggestion.assigneeId || undefined,
        sprintId:    suggestion.sprintId   || undefined,
        dueDate:     suggestion.dueDate    || undefined,
        labels:      suggestion.labels     || []
      })
      setConfirmedIds((prev) => new Set([...prev, msgId]))
      onTaskCreated?.()
      toast.success(`"${suggestion.title}" created successfully.`)
    } catch {
      toast.error('Failed to create task.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClose = () => {
    setMessages([])
    setInput('')
    setConfirmedIds(new Set())
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 520,
            height: 580,
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }
      }}
    >
      {/* Header */}
      <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              AI Assistant
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
              Create a task
            </p>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
              Describe what you need and it will be drafted for you.
            </p>
          </div>
          <IconButton
            onClick={handleClose}
            size='small'
            sx={{
              width: 30, height: 30,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#374151',
              flexShrink: 0,
              '&:hover': { background: '#0F172A', borderColor: '#0F172A', color: '#fff' },
              transition: 'all 0.15s ease'
            }}
          >
            <X size={13} strokeWidth={2} />
          </IconButton>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 20px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} onConfirmTask={handleConfirmTask} confirmedIds={confirmedIds} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #F1F5F9', flexShrink: 0, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <div
          style={{
            flex: 1,
            borderRadius: 12,
            border: '1.5px solid #E2E8F0',
            background: '#F8FAFC',
            padding: '9px 12px',
            transition: 'border-color 0.15s'
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#0F172A')}
          onBlurCapture={(e)  => (e.currentTarget.style.borderColor = '#E2E8F0')}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Fix login bug, high priority, assign to Alex…"
            rows={1}
            className='ai-chat-input'
            style={{
              width: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13,
              color: '#0F172A',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              overflow: 'hidden',
              display: 'block'
            }}
          />
          <style>{`.ai-chat-input::placeholder { color: #94A3B8; }`}</style>
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: input.trim() && !loading ? '#0F172A' : '#E2E8F0',
            color: input.trim() && !loading ? '#fff' : '#94A3B8',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'background 0.15s, color 0.15s'
          }}
        >
          <Send size={13} />
        </button>
      </div>
    </Dialog>
  )
}
