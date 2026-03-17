import { Box, Typography, Chip } from '@mui/material'
import { Clock, ArrowRight } from 'lucide-react'
import { COMPLEXITY_COLORS, CONFIDENCE_COLORS } from './constants'
import { timeRangeToDueDate } from './timeRangeToDueDate'

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No date'

export default function EstimateResultsStep({ results, selectedTasks }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {results.map((r) => {
        const task = selectedTasks.find((t) => t.id === r.id)
        const complexity = r.complexity?.toLowerCase() || 'medium'
        const c = COMPLEXITY_COLORS[complexity] || COMPLEXITY_COLORS.medium
        const confColor = CONFIDENCE_COLORS[r.confidence?.toLowerCase()] || CONFIDENCE_COLORS.medium
        const expectedDate = timeRangeToDueDate(r.timeRange)

        return (
          <Box key={r.id} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
            {/* Title + complexity */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                {task?.title || 'Task'}
              </Typography>
              <Chip
                label={complexity}
                size='small'
                sx={{ fontSize: 10.5, height: 20, fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: '5px', textTransform: 'capitalize', flexShrink: 0 }}
              />
            </Box>

            {/* Time range + confidence */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Clock size={12} color='#64748B' />
                <Typography sx={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600 }}>{r.timeRange}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: confColor }} />
                <Typography sx={{ fontSize: 11.5, color: '#64748B' }}>{r.confidence} confidence</Typography>
              </Box>
            </Box>

            {/* Due date: current → expected */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: r.factors?.length > 0 ? 1.5 : 0, p: 1.25, borderRadius: '8px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, mb: 0.25 }}>Current due date</Typography>
                <Typography sx={{ fontSize: 12, color: task?.dueDate ? '#0F172A' : '#94A3B8', fontWeight: 600 }}>
                  {task?.dueDate ? fmt(task.dueDate) : 'None'}
                </Typography>
              </Box>
              <ArrowRight size={13} color='#CBD5E1' style={{ flexShrink: 0 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, mb: 0.25 }}>Expected due date</Typography>
                <Typography sx={{ fontSize: 12, color: '#0F172A', fontWeight: 600 }}>{fmt(expectedDate)}</Typography>
              </Box>
            </Box>

            {/* Factors */}
            {r.factors?.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                {r.factors.map((f, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: '#94A3B8', mt: '6px', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>{f}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
