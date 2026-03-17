import { Box, Typography } from '@mui/material'
import { GitBranch } from 'lucide-react'

export default function SubtaskResultsStep({ subtaskResults, tasks }) {
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
    </Box>
  )
}
