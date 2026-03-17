'use client'

import { useState } from 'react'
import { Dialog, IconButton, Typography, Box, Button } from '@mui/material'
import { X, BarChart2, AlertTriangle, Users } from 'lucide-react'

const actions = [
  {
    id: 'bottlenecks',
    Icon: AlertTriangle,
    title: 'Detect bottlenecks',
    description: 'Identify columns or tasks blocking progress and slowing sprint velocity.'
  },
  {
    id: 'insights',
    Icon: BarChart2,
    title: 'Sprint insights',
    description: 'Get a breakdown of sprint health, trends, and predicted delivery timelines.'
  },
  {
    id: 'workload',
    Icon: Users,
    title: 'Workload balance',
    description: 'Analyze task distribution across team members and surface imbalances.'
  }
]

export default function BoardIntelligenceDialog({ open, onClose }) {
  const [selected, setSelected] = useState(null)

  const handleClose = () => {
    setSelected(null)
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
            width: 580,
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
            overflow: 'hidden'
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: '1px solid #F1F5F9' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.75 }}>
              AI Assistant
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
              Board-level intelligence
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              Get a bird&apos;s-eye view of your board with AI-driven analysis and team insights.
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size='small'
            sx={{
              width: 30, height: 30, border: '1px solid #E2E8F0', background: '#F8FAFC',
              color: '#374151', flexShrink: 0,
              '&:hover': { background: '#0F172A', borderColor: '#0F172A', color: '#fff' },
              transition: 'all 0.15s ease'
            }}
          >
            <X size={13} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, p: 2.5 }}>
        {actions.map((action) => {
          const isSelected = selected === action.id
          return (
            <Box
              key={action.id}
              onClick={() => setSelected(action.id)}
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
                  position: 'absolute', top: 8, right: 8, width: 12, height: 12,
                  borderRadius: '50%', border: isSelected ? '2px solid #0F172A' : '2px dashed #CBD5E1',
                  background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected && <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: '#0F172A' }} />}
              </Box>

              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', mb: 1, lineHeight: 1.3 }}>
                {action.title}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: '#374151', lineHeight: 1.6, mb: 2.5 }}>
                {action.description}
              </Typography>
              <Box
                sx={{
                  width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '10px', background: isSelected ? '#0F172A' : '#fff',
                  border: '1px solid #E2E8F0', color: isSelected ? '#fff' : '#0F172A',
                  mt: 'auto', transition: 'all 0.15s ease'
                }}
              >
                <action.Icon size={17} strokeWidth={1.8} />
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.75, borderTop: '1px solid #F1F5F9' }}>
        <Typography sx={{ fontSize: 11, color: '#64748B' }}>Powered by AI · Results may vary</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            size='small'
            sx={{
              fontSize: 12, fontWeight: 500, color: '#0F172A', border: '1px solid #E2E8F0',
              borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: 'transparent',
              '&:hover': { background: '#F1F5F9', borderColor: '#CBD5E1' }, transition: 'all 0.15s ease'
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selected}
            size='small'
            sx={{
              fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A',
              borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A',
              '&:hover': { background: '#1E293B', borderColor: '#1E293B' },
              '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' },
              transition: 'all 0.15s ease'
            }}
          >
            Run
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
