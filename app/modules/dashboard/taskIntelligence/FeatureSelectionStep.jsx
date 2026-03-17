import { Box, Typography } from '@mui/material'
import { ACTIONS } from './constants'

export default function FeatureSelectionStep({ selected, onSelect }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
      {ACTIONS.map((action) => {
        const isSelected = selected === action.id
        return (
          <Box
            key={action.id}
            onClick={() => onSelect(action.id)}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 2.5,
              borderRadius: '12px',
              background: isSelected ? '#F0F4FF' : '#F8FAFC',
              border: isSelected ? '1.5px solid #0F172A' : '1.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                background: isSelected ? '#F0F4FF' : '#F1F5F9',
                border: isSelected ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0'
              }
            }}
          >
            {/* Radio indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: isSelected ? '2px solid #0F172A' : '2px dashed #CBD5E1',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              {isSelected && (
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: '#0F172A' }} />
              )}
            </Box>

            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', mb: 1, lineHeight: 1.3 }}>
              {action.title}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: '#374151', lineHeight: 1.6, mb: 2.5 }}>
              {action.description}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: isSelected ? '#0F172A' : '#fff',
                border: '1px solid #E2E8F0',
                color: isSelected ? '#fff' : '#0F172A',
                mt: 'auto',
                transition: 'all 0.15s ease'
              }}
            >
              <action.Icon size={17} strokeWidth={1.8} />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
