import { Box, Typography } from '@mui/material'

export default function LoadingStep({ progress, loadingMsg, taskCount }) {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 12.5, color: '#374151', fontWeight: 500 }}>{loadingMsg}</Typography>
        <Typography sx={{ fontSize: 12, color: '#94A3B8' }}>{progress}%</Typography>
      </Box>
      <Box sx={{ height: 6, borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            borderRadius: '99px',
            background: '#0F172A',
            width: `${progress}%`,
            transition: 'width 0.4s ease'
          }}
        />
      </Box>
      <Typography sx={{ fontSize: 11, color: '#94A3B8', mt: 2 }}>
        Analyzing {taskCount} task{taskCount !== 1 ? 's' : ''}...
      </Typography>
    </Box>
  )
}
