'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Checkbox } from '@mui/material'
import { Users, ArrowRight, CheckCircle } from 'lucide-react'

// Same palette and hash as TaskCard / MembersPanel — keeps avatar colors consistent
const AVATAR_PALETTE = [
  '#3B82F6', // blue-500
  '#22C55E', // green-500
  '#A855F7', // purple-500
  '#F97316', // orange-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#EF4444', // red-500
]

function getAvatarColor(id = '') {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

const LOAD_BADGE = {
  high:   { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  medium: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  low:    { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' }
}

// ── Member bar chart ──────────────────────────────────

function MemberBar({ member, maxCount, index }) {
  const [animated, setAnimated] = useState(false)
  const avatarColor = getAvatarColor(member.userId)
  const badge       = LOAD_BADGE[member.load] || LOAD_BADGE.medium
  const pct         = maxCount > 0 ? Math.max((member.taskCount / maxCount) * 100, member.taskCount > 0 ? 5 : 0) : 0

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80 + index * 60)
    return () => clearTimeout(t)
  }, [index])

  const initials = member.name
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      {/* Avatar — same color as TaskCard / MembersPanel */}
      <Box
        sx={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: avatarColor, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700
        }}
      >
        {initials}
      </Box>

      {/* Name */}
      <Typography
        sx={{ fontSize: 11.5, color: '#374151', width: 90, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        title={member.name}
      >
        {member.name}
      </Typography>

      {/* Bar */}
      <Box sx={{ flex: 1, height: 16, borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
        <Box
          sx={{
            width: animated ? `${pct}%` : '0%',
            height: '100%',
            borderRadius: '99px',
            background: avatarColor,
            opacity: 0.85,
            transition: `width ${0.5 + index * 0.07}s cubic-bezier(0.4, 0, 0.2, 1)`
          }}
        />
      </Box>

      {/* Count */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#374151', width: 16, textAlign: 'right', flexShrink: 0 }}>
        {member.taskCount}
      </Typography>

      {/* Load badge */}
      <Box
        sx={{
          fontSize: 9.5, fontWeight: 700, px: 0.75, py: 0.15, borderRadius: '4px',
          background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`,
          textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0
        }}
      >
        {member.load}
      </Box>
    </Box>
  )
}

// ── Suggestion card ───────────────────────────────────

function SuggestionCard({ suggestion, checked, onToggle }) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex', alignItems: 'flex-start', gap: 1.25,
        p: 1.5, borderRadius: '10px', cursor: 'pointer',
        border: checked ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0',
        background: checked ? '#F8FAFC' : '#FAFAFA',
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: checked ? '#0F172A' : '#CBD5E1', background: '#F8FAFC' }
      }}
    >
      <Checkbox
        checked={checked}
        size='small'
        disableRipple
        sx={{
          p: 0, flexShrink: 0, mt: 0.15,
          color: '#CBD5E1',
          '&.Mui-checked': { color: '#0F172A' }
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Task title */}
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, mb: 0.5 }}>
          {suggestion.taskTitle}
        </Typography>

        {/* From → To */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
          <Box sx={{ fontSize: 10.5, px: 1, py: 0.15, borderRadius: '5px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
            {suggestion.fromUserName}
          </Box>
          <ArrowRight size={11} color='#94A3B8' />
          <Box sx={{ fontSize: 10.5, px: 1, py: 0.15, borderRadius: '5px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
            {suggestion.toUserName}
          </Box>
        </Box>

        {/* Reason */}
        <Typography sx={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>
          {suggestion.reason}
        </Typography>
      </Box>
    </Box>
  )
}

// ── Main component ────────────────────────────────────

export default function WorkloadResultsStep({ members, summary, suggestions, checkedIds, onToggle }) {
  const maxCount  = Math.max(...members.map((m) => m.taskCount), 1)
  const totalTasks = members.reduce((sum, m) => sum + m.taskCount, 0)

  const sortedMembers = [...members].sort((a, b) => b.taskCount - a.taskCount)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Key stats row */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[
          { label: 'Team size',    value: members.length },
          { label: 'Total tasks',  value: totalTasks },
          { label: 'Most loaded',  value: sortedMembers[0]?.name?.split(' ')[0] || '—' },
          { label: 'Avg per person', value: members.length > 0 ? (totalTasks / members.length).toFixed(1) : '—' }
        ].map((s) => (
          <Box
            key={s.label}
            sx={{ flex: 1, p: 1.5, borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
              <Users size={11} color='#94A3B8' />
              <Typography sx={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{s.label}</Typography>
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{s.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Bar chart */}
      <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A', mb: 1.5 }}>
          Task Distribution
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sortedMembers.map((m, i) => (
            <MemberBar key={m.userId} member={m} maxCount={maxCount} index={i} />
          ))}
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, pt: 1.25, borderTop: '1px solid #F1F5F9' }}>
          {Object.entries(LOAD_BADGE).map(([level, c]) => (
            <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '3px', background: c.bg, border: `1px solid ${c.border}` }} />
              <Typography sx={{ fontSize: 10, color: c.text, fontWeight: 600, textTransform: 'capitalize' }}>{level} load</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* AI Summary */}
      <Box sx={{ p: 2, borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.75 }}>
          AI Summary
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: '#374151', lineHeight: 1.65 }}>{summary}</Typography>
      </Box>

      {/* Suggested reassignments */}
      <Box>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0F172A', mb: 1 }}>
          Suggested Reassignments
          {suggestions.length > 0 && (
            <Typography component='span' sx={{ fontSize: 11, color: '#94A3B8', fontWeight: 400, ml: 0.75 }}>
              — select which ones to apply
            </Typography>
          )}
        </Typography>

        {suggestions.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5, px: 2, borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle size={14} color='#22C55E' />
            <Typography sx={{ fontSize: 12.5, color: '#166534' }}>
              Workload looks balanced — no reassignments needed.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {suggestions.map((s) => (
              <SuggestionCard
                key={s.taskId}
                suggestion={s}
                checked={checkedIds.includes(s.taskId)}
                onToggle={() => onToggle(s.taskId)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
