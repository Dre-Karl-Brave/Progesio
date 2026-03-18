import { Box, Typography } from '@mui/material'
import { ArrowRight, CheckCircle } from 'lucide-react'

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  medium: { label: 'Medium', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  high:   { label: 'High',   bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  urgent: { label: 'Urgent', bg: '#FFF1F2', text: '#881337', border: '#FECDD3' }
}

function PriorityBadge({ priority }) {
  const c = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  return (
    <Box sx={{ fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: '5px', background: c.bg, color: c.text, border: `1px solid ${c.border}`, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {c.label}
    </Box>
  )
}

export default function OrganizeResultsStep({ suggestions, selectedTasks }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {suggestions.map((s) => {
        const task = selectedTasks.find((t) => t.id === s.id)
        return (
          <Box key={s.id} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
            {/* Title */}
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, mb: 1.25 }}>
              {task?.title || s.id}
            </Typography>

            {/* Priority change row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <PriorityBadge priority={task?.priority || 'medium'} />
              {s.changed ? (
                <>
                  <ArrowRight size={13} color='#94A3B8' />
                  <PriorityBadge priority={s.suggestedPriority} />
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
                  <CheckCircle size={12} color='#22C55E' />
                  <Typography sx={{ fontSize: 11, color: '#64748B' }}>Retained</Typography>
                </Box>
              )}
            </Box>

            {/* Reason */}
            <Typography sx={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.6 }}>
              {s.reason}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
