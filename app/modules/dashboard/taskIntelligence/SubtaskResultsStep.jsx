import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material'
import { GitBranch, Trash2 } from 'lucide-react'

export default function SubtaskResultsStep({ subtaskResults, tasks, deleteMainTasks, onDeleteMainTasksChange }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {subtaskResults.map((result) => {
        const parent = tasks.find((t) => t.id === result.parentId)
        return (
          <Box key={result.parentId}>
            {/* Parent task label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <GitBranch size={13} color='#64748B' />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {parent?.title || result.parentId}
              </Typography>
            </Box>

            {/* Subtask cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pl: 2.5, borderLeft: '2px solid #E2E8F0' }}>
              {result.items.map((item, i) => (
                <Box key={i} sx={{ p: 1.5, borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A', mb: 0.4, lineHeight: 1.4 }}>
                    {item.title}
                  </Typography>
                  {item.description && (
                    <Typography sx={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>
                      {item.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )
      })}

      {/* Delete original tasks option */}
      <Box sx={{ mt: 1, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={deleteMainTasks}
              onChange={(e) => onDeleteMainTasksChange(e.target.checked)}
              size='small'
              sx={{
                color: '#CBD5E1',
                '&.Mui-checked': { color: '#EF4444' },
                p: 0.5
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Trash2 size={13} color={deleteMainTasks ? '#EF4444' : '#94A3B8'} />
              <Typography sx={{ fontSize: 12.5, color: deleteMainTasks ? '#EF4444' : '#64748B', fontWeight: deleteMainTasks ? 500 : 400 }}>
                Delete original task{subtaskResults.length !== 1 ? 's' : ''} after breakdown
              </Typography>
            </Box>
          }
          sx={{ m: 0, gap: 0.5 }}
        />
      </Box>
    </Box>
  )
}
