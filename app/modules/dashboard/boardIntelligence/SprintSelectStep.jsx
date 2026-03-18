'use client'

import { Box, Typography } from '@mui/material'
import { CalendarDays, Target } from 'lucide-react'

function formatRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

function durationDays(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
}

export default function SprintSelectStep({ sprints, selected, onSelect, loading }) {
  if (loading) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>Loading completed sprints...</Typography>
      </Box>
    )
  }

  if (sprints.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          No completed sprints found on this board.
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 0.5 }}>
          Complete a sprint first to generate insights.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Typography sx={{ fontSize: 12, color: '#64748B', mb: 0.5 }}>
        Select a completed sprint to analyze.
      </Typography>
      {sprints.map((sprint) => {
        const isSelected = selected?.id === sprint.id
        const days = durationDays(sprint.startDate, sprint.endDate)
        return (
          <Box
            key={sprint.id}
            onClick={() => onSelect(sprint)}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: '12px',
              background: isSelected ? '#F0F4FF' : '#F8FAFC',
              border: isSelected ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                background: isSelected ? '#F0F4FF' : '#F1F5F9',
                borderColor: isSelected ? '#0F172A' : '#CBD5E1'
              }
            }}
          >
            {/* Radio indicator */}
            <Box
              sx={{
                position: 'absolute', top: 12, right: 12, width: 12, height: 12,
                borderRadius: '50%', border: isSelected ? '2px solid #0F172A' : '2px dashed #CBD5E1',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease', flexShrink: 0
              }}
            >
              {isSelected && <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: '#0F172A' }} />}
            </Box>

            {/* Sprint name + duration */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, pr: 3 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                {sprint.name}
              </Typography>
              <Box
                sx={{
                  fontSize: 10, px: 1, py: 0.15, borderRadius: '5px',
                  background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
                  whiteSpace: 'nowrap'
                }}
              >
                {days} days
              </Box>
            </Box>

            {/* Date range */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: sprint.goal ? 0.5 : 0 }}>
              <CalendarDays size={11} color='#94A3B8' />
              <Typography sx={{ fontSize: 11.5, color: '#64748B' }}>
                {formatRange(sprint.startDate, sprint.endDate)}
              </Typography>
            </Box>

            {/* Goal */}
            {sprint.goal && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 0.5 }}>
                <Target size={11} color='#94A3B8' style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>
                  {sprint.goal}
                </Typography>
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
