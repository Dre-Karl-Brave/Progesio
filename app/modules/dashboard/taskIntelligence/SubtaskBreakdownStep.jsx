import { Box, Typography, Checkbox } from '@mui/material'
import { AlertCircle } from 'lucide-react'

export default function SubtaskBreakdownStep({ bigTasks, tasks, checkedIds, onToggle, error }) {
  return (
    <Box>
      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={14} color='#DC2626' />
          <Typography sx={{ fontSize: 12, color: '#DC2626' }}>{error}</Typography>
        </Box>
      )}

      {bigTasks.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            No tasks found that need breaking down. Your board looks well-scoped!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {bigTasks.map((bt) => {
            const task = tasks.find((t) => t.id === bt.id)
            const checked = checkedIds.includes(bt.id)
            return (
              <Box
                key={bt.id}
                onClick={() => onToggle(bt.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  p: 1.5,
                  borderRadius: '10px',
                  border: checked ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0',
                  background: checked ? '#F8FAFC' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { background: '#F8FAFC', borderColor: checked ? '#0F172A' : '#CBD5E1' }
                }}
              >
                <Checkbox
                  checked={checked}
                  size='small'
                  disableRipple
                  sx={{
                    p: 0,
                    mt: '1px',
                    color: '#CBD5E1',
                    '&.Mui-checked': { color: '#0F172A' }
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                    {task?.title || bt.id}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#64748B', mt: 0.4, lineHeight: 1.5 }}>
                    {bt.reason}
                  </Typography>
                </Box>
                {task?.columnName && (
                  <Box sx={{ fontSize: 10, color: '#64748B', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '4px', px: 0.75, py: 0.25, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {task.columnName}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      )}

      <Typography sx={{ fontSize: 11, color: '#94A3B8', mt: 1.5 }}>
        {checkedIds.length === 0
          ? 'Select at least one task to generate subtasks.'
          : `${checkedIds.length} task${checkedIds.length !== 1 ? 's' : ''} selected for breakdown.`}
      </Typography>
    </Box>
  )
}
